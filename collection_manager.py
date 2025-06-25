import json
from collections import Counter
from python.submit import SubmitForm
from config.config import LORAS


class CollectionManager():
    def __init__(self, collection_name: str = "Test"):
        self._stale = False  # Tracks if active_collection is up-to-date
        self.active_route = None
        self.collection = None
        self.set_collection(collection_name)

        self.tag_frequency = self._count_tags()   # TODO IDK rather than a var just do this when it's called?




    # TODO - Make a set active route function rather than setting in init.

    # REFRESH collection any time collection is read.
    # Refresh method

    # One class for loading/saving files and one for managing ops?
    # Storage vs manage

    # Put @propery above active_collection so any time it's called state updated
    # Basically when you type self.active_col it runs the method tagged with @prop

    # --------------------
    # Properties
    # --------------------
    @property  # noqa
    def collection(self) -> list:
        """This function will run whenever collection is called.
        Refreshes collection if marked as stale."""
        if self._stale:
            pass

    # --------------------
    # Public Setters
    # --------------------
    def set_collection(self, file_name):
        self.active_route = f"collections/{file_name.lower()}.json"
        self.collection = self._prep_collect(self.active_route)

    # --------------------
    # Public Getters
    # --------------------
    def get_collection(self) -> list:
        """Returns the collection"""
        return self.collection

    def get_tag_frequency(self) -> dict:
        """Returns list of tags sorted by most common"""
        tags = []
        for entry in self.collection:
            tags.extend(entry.get("Tags", []))

        tag_counts = Counter(tags)
        frequency = [tag for tag, count in tag_counts.most_common()]

        return frequency

    def update_ranking(self, key_url, change):
        """Changes the ranking of one ACTIVE collection element.
        URL used to determine the target element/image."""
        for image in self.collection:
            if image['url'] == key_url:
                image['ranking'] += change
                break
        self._write_changes()

    def _prep_collect(self, route):
        """Given a route, returns an up-to-date sorted collection"""
        collect = self._open_collect(route)
        sorted_collect = self._sort_collect(collect)
        self._stale = False
        return sorted_collect

    def _open_collect(self, route):
        """Opens, loads, saves, and returns a JSON collection."""
        with open(route) as f:
            collection = json.load(f)
        return collection

    def _sort_collect(self, collection: list):
        """Sorts a collection by 'ranking' and returns the sorted list."""
        return sorted(collection,
                      key=lambda x: x.get("ranking", 0),
                      reverse=True)

    def format_entry(self, form: SubmitForm, lora_json):
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

    def add_entry(self, entry_data):
        """Adds a new entry to the active collection."""
        self.collection.append(entry_data)
        self._write_changes()

    def _write_changes(self):
        """Writes pending changes to active JSON.  Change status to stale"""
        with open(self.active_route, 'w') as f:
            json.dump(self.collection, f, indent=4)
        self._stale = True

    def _count_tags(self):
        """Counts frequency of each tag in the active collection
        Sorts with most frequent at top."""
        tag_frequency = dict()
        for entry in self.collection:
            for tag in entry.get("Tags", []):
                tag_frequency[tag] = tag_frequency.get(tag, 0) + 1
        tag_frequency = dict(sorted(tag_frequency.items(),
                                    key=lambda x: x[1],
                                    reverse=True))
        return tag_frequency

    def get_tag_frequency(self):
        return self.tag_frequency

    def get_entry(self, url):
        """Returns a single entry from active collection by URL"""
        for entry in self.collection:
            if entry["url"] == url:
                return entry
        return False

    def get_entry_index(self, url):
        for i, entry in enumerate(self.collection):
            if entry["url"] == url:
                return i
        return False

    def add_tags(self, url, tags):
        """Adds tags from list to entry with given url"""
        tags = [tag.lower() for tag in tags]
        entry = self.get_entry(url)
        combined_tags = list(set(entry["Tags"] + tags))
        entry["Tags"] = combined_tags
        self._write_changes()

    def edit_entry(self, entry_data):
        """Replaces an existing an entry with the given data."""
        self.delete_entry(entry_data["url"])
        self.add_entry(entry_data)
        # Changes are written with add_entry

    def delete_entry(self, url):
        """Removes entry from collection."""
        del self.collection[self.get_entry_index(url)]
        print("Deleted Entry:", url)

    def prepare_form(self, url):
        """Returns entry in the style of a submit form."""
        entry_data = self.get_entry(url)

        lora_data_from_entry = entry_data.get('LoRA', {})

        form_data = {
            'url': entry_data.get('url', ''),
            'model': entry_data.get('model', ''),
            'prompt': entry_data.get('Prompt', ''),
            'sampling_method': entry_data.get('Sampling Method', ''),
            'sampling_steps': entry_data.get('Sampling Steps', 10),
            'cfg_scale': entry_data.get('CFG Scale', 2.0),
            'tags': entry_data.get('Tags', []),
            **{key: value for key, value in lora_data_from_entry.items() if key in LORAS.keys()}
        }

        entry_form = SubmitForm(data=form_data)

        for lora_name, lora_strength in lora_data_from_entry.items():
            if lora_name not in LORAS.keys():
                name_field = entry_form.dynamic_loras.append_entry()
                name_field.data = lora_name

                strength_field = entry_form.dynamic_strengths.append_entry()
                strength_field.data = lora_strength

        return entry_form

# TODO - Be more intentional and careful with stale.
# TODO - Also assume set is always active unless changed
