# TODO Organize this class better?
import json
from python.submit import SubmitForm


class CollectionManager():
    def __init__(self, collection_name: str):
        self.route_dict = {
            'Test': "collections/test.json",
            'Gallery': "collections/gallery.json",
            'Test2': "collections/llamas.json"
            }
        self.stale = True  # Tracks if active_collection is up-to-date
        self.active_route = self.route_dict[collection_name]
        self.active_collection = self._prep_collect(self.active_route)
        self.tag_frequency = self._count_tags()
        # Note- Use arg bc _prep_collect may use dif routes elsewhere

    # TODO - Make a set active route function rather than setting in init.

    def get_collection(self):
        """Returns the ACTIVE collection"""
        if self.stale:
            self.active_collection = self._prep_collect(self.active_route)
        return self.active_collection

    def update_ranking(self, key_url, change):
        """Changes the ranking of one ACTIVE collection element.
        URL used to determine the target element/image."""
        for image in self.active_collection:
            if image['url'] == key_url:
                image['ranking'] += change
                break
        self._write_changes()

    def _prep_collect(self, route):
        """Given a route, returns an up-to-date sorted collection"""
        collect = self._open_collect(route)
        sorted_collect = self._sort_collect(collect)
        self.stale = False
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
        self.active_collection.append(entry_data)
        self._write_changes()

    def _write_changes(self):
        """Writes pending changes to active JSON.  Change status to stale"""
        with open(self.active_route, 'w') as f:
            json.dump(self.active_collection, f, indent=4)
        self.stale = True

    def _count_tags(self):
        """Counts frequency of each tag in the active collection
        Sorts with most frequent at top."""
        tag_frequency = dict()
        for entry in self.active_collection:
            for tag in entry.get("Tags", []):
                tag_frequency[tag] = tag_frequency.get(tag, 0) + 1
        tag_frequency = dict(sorted(tag_frequency.items(),
                                    key=lambda x: x[1],
                                    reverse=True))
        return tag_frequency

    def get_tag_frequency(self):
        return self.tag_frequency
