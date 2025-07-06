import json
from collections import Counter
from python.submit import SubmitForm
from config.config import LORAS, QUICK_SUBSTITUTION


class CollectionManager():
    def __init__(self, collection_name: str = "Test"):
        self._stale = False
        self.route = None
        self._collection_list = []  # Initialize the backing field
        # Collection is stale if class data != JSON data.
        self.set_collection(collection_name)

    # --------------------
    # Properties
    # --------------------
    @property
    def collection(self) -> list:
        """This function will run whenever collection is called.
        Updates JSON if collection is stale."""
        if self._stale:
            with open(self.route, 'w') as f:
                json.dump(self._collection_list, f, indent=4)
            self._stale = False
        return self._collection_list

    @collection.setter
    def collection(self, new_collection: list):
        if not isinstance(new_collection, list):
            raise ValueError("Collection must be a list.")
        self._collection_list = new_collection
        self._stale = True

    # --------------------
    # Public Setters
    # --------------------
    def set_collection(self, file_name):
        self.route = f"collections/{file_name.lower()}.json"
        with open(self.route) as f:
            collection = json.load(f)
        collection.sort(key=lambda x: x.get("ranking", 0), reverse=True)
        self.collection = collection
        self._stale = True

    # --------------------
    # Public Getters
    # --------------------
    def get_collection(self) -> list:
        """Returns the collection"""
        return self.collection

    def get_route(self):
        return self.route

    def get_tags(self) -> list:
        """Returns list of tags sorted by most common"""
        # Technically, it's better to keep a dict of tags and counts
        # Then increment when new tags added but this simplifies it.
        tags = []
        for entry in self.collection:
            tags.extend(entry.get("Tags", []))

        tag_counts = Counter(tags)
        frequency = [tag for tag, count in tag_counts.most_common()]

        return frequency

    def get_loras(self):
        """Returns a list of LoRAs sorted by most common"""
        lora_names = []
        for entry in self.collection:
            lora_data = entry.get("LoRA", {})
            lora_names.extend(lora_data.keys())

        lora_counts = Counter(lora_names)
        frequency = [lora for lora, count in lora_counts.most_common()]
        return frequency

    def get_submit_form(self, url) -> SubmitForm:
        """Returns entry data in format of a submit form"""
        entry_data = self._get_entry(url)[0]
        form_data = self._helper_prepare_form_data(entry_data)
        entry_form = SubmitForm(data=form_data)
        return self._helper_add_dynamic_loras(entry_data, entry_form)

    # --------------------
    # Public Methods
    # --------------------
    def add_entry(self, entry_data):
        # Check For Dupe
        if self._get_entry(entry_data['url']):
            return False
        # Add Entry
        self.collection.append(entry_data)
        self._stale = True
        return True

    def add_tags(self, url, tags):
        entry = self._get_entry(url)[0]
        added_tags = [tag.lower() for tag in tags]
        entry.setdefault("Tags", [])
        all_tags = list(set(entry["Tags"] + added_tags))
        entry["Tags"] = all_tags
        self._stale = True

    def delete_entry(self, url):
        del self.collection[self._get_entry(url)[1]]
        self._stale = True

    def edit_entry(self, entry_data):
        """Replaces an existing an entry with the given data."""
        self.delete_entry(entry_data["url"])
        self.add_entry(entry_data)
        self._stale = True

    def edit_ranking(self, url, change):
        entry = self._get_entry(url)[0]
        if entry:
            entry['ranking'] = entry.get('ranking', 0) + change
        else:
            print("Error: Entry not found.")
        self._stale = True

    # --------------------
    # Private Methods
    # --------------------
    def _get_entry(self, url):
        """Returns reference to an entry and its index
        Allowing its entry in collection to be edited."""
        for i, entry in enumerate(self.collection):
            if entry["url"] == url:
                return (entry, i)
        return False

    # --------------------
    # Static Methods
    # --------------------
    @staticmethod
    def format_entry(form: SubmitForm, lora_json):
        """Given data from submit form, structures it into a new JSON entry."""
        lora_data = json.loads(lora_json)
        entry_data = {
            "url": form.url.data,
            "model": form.model.data,
            "Prompt": form.prompt.data,
            "Tags": [tag.data.lower() for tag in form.tags if tag.data],
            "LoRA": lora_data,
            "Sampling Method": form.sampling_method.data,
            "Sampling Steps": form.sampling_steps.data,
            "CFG Scale": form.cfg_scale.data,
            "ranking": 0
        }
        return entry_data

    @staticmethod
    def format_quick_entry(entry_string: str, img_url: str):
        """Quick entries already have the proper structure"""
        entry_dict = json.loads(entry_string)
        entry_dict['url'] = img_url
        # Round Entries
        for key, value in entry_dict["LoRA"].items():
            if isinstance(value, (int, float)):
                entry_dict["LoRA"][key] = round(value, 1)

        # Replace Model Names
        if entry_dict["model"] in QUICK_SUBSTITUTION:
            entry_dict["model"] = QUICK_SUBSTITUTION[entry_dict["model"]]

        # Replace LoRA Names
        if "LoRA" in entry_dict and entry_dict["LoRA"] is not None:
            for key in list(entry_dict["LoRA"].keys()):
                if key in QUICK_SUBSTITUTION:
                    new_key = QUICK_SUBSTITUTION[key]
                    if new_key != key:
                        entry_dict["LoRA"][new_key] = entry_dict["LoRA"][key]
                        del entry_dict["LoRA"][key]

        return entry_dict

    @staticmethod
    def _helper_add_dynamic_loras(entry_data: dict, submit_form: SubmitForm):
        """Add dynamic LoRAs to the form"""
        entry_lora_data = entry_data.get('LoRA', {})

        for lora_name, lora_strength in entry_lora_data.items():
            if lora_name not in LORAS.keys():
                name_field = submit_form.dynamic_loras.append_entry()
                name_field.data = lora_name
                strength_field = submit_form.dynamic_strengths.append_entry()
                strength_field.data = lora_strength

        return submit_form

    @staticmethod
    def _helper_prepare_form_data(entry_data: dict) -> dict:
        """
        Extracts form data and known LoRAs into a dictionary for SubmitForm.
        """
        lora_data_from_entry = entry_data.get('LoRA', {})

        form_data = {
            'url': entry_data.get('url', ''),
            'model': entry_data.get('model', ''),
            'prompt': entry_data.get('Prompt', ''),
            'sampling_method': entry_data.get('Sampling Method', ''),
            'sampling_steps': entry_data.get('Sampling Steps', 10),
            'cfg_scale': entry_data.get('CFG Scale', 2.0),
            'tags': entry_data.get('Tags', []),
        }

        for lora_name, lora_strength in lora_data_from_entry.items():
            if lora_name in LORAS.keys():
                form_data[lora_name] = lora_strength
        return form_data
