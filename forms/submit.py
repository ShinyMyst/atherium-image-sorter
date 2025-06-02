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


class SubmitForm(FlaskForm):
    # Data Sets
    data_sets = SelectMultipleField(
        choices=[
            ('test', 'Test File')
        ]
    )
    # Basic Information
    url = StringField('Image URL')
    model = SelectField('Model', choices=[
        ('Hoshino', 'Hoshino'),
        ('Hoseki', 'Hoseki')
        ])
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

    lora_fields = [dmd2, lcm, bold_outlines, vivid_edge, vivid_soft, cartoony]

    # LoRA Details
    sampling_method = SelectField('Sampling Method', choices=[
        ('Euler A', 'Euler A'),
        ('Euler', 'Euler'),
        ('DDIM', 'DDIM'),
        ('LMS', 'LMS')
        ])
    sampling_steps = IntegerField('Sampling Steps', default=10)
    cfg_scale = IntegerField('CFG Steps', default=2)

    # Submit
    submit = SubmitField('Submit')
