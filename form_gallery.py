from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, SelectField, IntegerField, TextAreaField
from wtforms.fields import BooleanField
from wtforms.validators import DataRequired


# TODO - Move choice field choices elsewhere as var.


class GalleryForm(FlaskForm):
    # Data Sets
    gallery = BooleanField('Gallery')
    style_kagerou = BooleanField('Style Kagerou')
    style_holo = BooleanField('Style Holo')

    # Basic Information
    url = StringField('Image URL')
    model = SelectField('Model', choices = [('Hoshino', 'Hoshino'), ('Hoseki', 'Hoseki')]) # noqa
    prompt = TextAreaField('Prompt', default='...')

    # LoRA
    dmd2 = IntegerField('DMD2', default=0)
    lcm = IntegerField('LCM', default=0)
    bold_outlines = IntegerField('Bold Outlines', default=0)
    vivid_edge = IntegerField('Vivid Edge', default=0)
    vivid_soft = IntegerField('Vivid Soft', default=0)

    # LoRA Details
    sampling_method = SelectField('Sampling Method', choices=[('Euler A', 'Euler A'), ('Euler', 'Euler'), ('DDIM', 'DDIM'), ('LMS', 'LMS')]) # noqa
    sampling_steps = IntegerField('Sampling Steps', default=10)

    submit = SubmitField('Submit')