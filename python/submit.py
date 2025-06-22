from flask_wtf import FlaskForm
from wtforms import (
    StringField,
    SubmitField,
    SelectField,
    IntegerField,
    FloatField,
    TextAreaField,
    FieldList,
    SelectMultipleField
)
from config.config import COLLECTIONS, MODELS, LORAS, SAMPLING_METHODS


class SubmitForm(FlaskForm):
    # Data Sets
    data_sets = SelectMultipleField(
        choices=[name for name in COLLECTIONS.keys()]
    )

    # Basic Information
    url = StringField('Image URL')
    model = SelectField('Model', choices=MODELS)
    prompt = TextAreaField('Prompt', default='...')
    tags = FieldList(StringField('Tag'), min_entries=0)

    # LORAS
    default_loras = {lora_name: 0 for lora_name in LORAS.keys()}

    for name, default in default_loras.items():
        locals()[name] = FloatField(name.replace('_', ' ').title(), default=default) # noqa

    dynamic_loras = FieldList(StringField('LoRA Type'), min_entries=0)
    dynamic_strengths = FieldList(FloatField('Strength'), min_entries=0)

    @property
    def lora_fields(self):
        return [getattr(self, name) for name in self.default_loras.keys()]

    # Sampling Details
    sampling_method = SelectField('Sampling Method', choices=SAMPLING_METHODS)
    sampling_steps = IntegerField('Sampling Steps', default=10)
    cfg_scale = FloatField('CFG Scale', default=2)

    # Submit
    submit = SubmitField('Submit')
