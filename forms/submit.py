from flask_wtf import FlaskForm
from wtforms import (
    StringField,
    SubmitField,
    SelectField,
    IntegerField,
    FloatField,
    TextAreaField,
    BooleanField
)


class SubmitForm(FlaskForm):
    # Data Sets
    gallery = BooleanField('Gallery')
    style_kagerou = BooleanField('Style Kagerou')
    style_holo = BooleanField('Style Holo')

    # Basic Information
    url = StringField('Image URL')
    model = SelectField('Model', choices=[
        ('Hoshino', 'Hoshino'),
        ('Hoseki', 'Hoseki')
        ])
    prompt = TextAreaField('Prompt', default='...')

    # LoRA
    dmd2 = FloatField('DMD2', default=0)
    lcm = FloatField('LCM', default=0)
    bold_outlines = FloatField('Bold Outlines', default=0)
    vivid_edge = FloatField('Vivid Edge', default=0)
    vivid_soft = FloatField('Vivid Soft', default=0)

    # LoRA Details
    sampling_method = SelectField('Sampling Method', choices=[
        ('Euler A', 'Euler A'),
        ('Euler', 'Euler'),
        ('DDIM', 'DDIM'),
        ('LMS', 'LMS')
        ])
    sampling_steps = IntegerField('Sampling Steps', default=10)

    # Submit
    submit = SubmitField('Submit')
