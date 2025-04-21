
from flask_wtf import FlaskForm
from wtforms import SelectField, FloatField


class GalleryForm(FlaskForm):
    # Model - Dropdown
    model = SelectField('Model', choices=[
        ('any', 'Any'),
        ('hoseki', 'Hoseki'),
        ('hoshino', 'Hoshino')
    ])

    # LoRA - Sliders
    dmd2 = FloatField('DMD2', default=0)
    lcm = FloatField('LCM', default=0)
    bold_outlines = FloatField('Bold Outlines', default=0)
    vivid_edge = FloatField('Vivid Edge', default=0)
    vivid_soft = FloatField('Vivid Soft', default=0)

    lora = [
        ("DMD2", None),
        ("LCM", None),
        ("Bold Outlines", None),
        ("Vivid Edge", None),
        ("Vivid Soft", None)
    ]

    # Sampling - Dropdown
    sampling = SelectField('Sampling', choices=[
        ('any', 'Any'),
        ('euler a', 'Euler A'),
        ('ddim', 'DDIM'),
        ('lms', 'LMS')
    ])
