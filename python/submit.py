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
from config.config import COLLECTIONS, MODELS, SAMPLING_METHODS


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

    # LoRA
    dmd2 = FloatField('DMD2', default=0)
    lcm = FloatField('LCM', default=0)
    bold_outlines = FloatField('Bold Outlines', default=0)
    vivid_edge = FloatField('Vivid Edge', default=0)
    vivid_soft = FloatField('Vivid Soft', default=0)
    cartoony = FloatField('Cartoony', default=0)
    # URL needs hardcoded into html for now

    dynamic_loras = FieldList(StringField('LoRA Type'), min_entries=0)
    dynamic_strengths = FieldList(FloatField('Strength'), min_entries=0)

    @property
    def lora_fields(self):
        return [
            self.dmd2,
            self.lcm,
            self.bold_outlines,
            self.vivid_edge,
            self.vivid_soft,
            self.cartoony
        ]
    # Sampling Details
    sampling_method = SelectField('Sampling Method', choices=SAMPLING_METHODS)
    sampling_steps = IntegerField('Sampling Steps', default=10)
    cfg_scale = FloatField('CFG Scale', default=2)

    # Submit
    submit = SubmitField('Submit')
