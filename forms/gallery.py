
from flask_wtf import FlaskForm
from wtforms import SelectField  # , FloatField


class GalleryForm(FlaskForm):
    # Model - Dropdown
    model = SelectField('Model', choices=[
        ('any', 'Any'),
        ('hoseki', 'Hoseki'),
        ('hoshino', 'Hoshino')
    ])

    # LoRA - Sliders
    # (Macro is used to format these)
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

    # Tags - Toggle Box
    default_tags = ["style", "kagerou", "invalid", "test"]


"""
TODO - It 'might' be worth considering rather than using a form here,
making the gallery route its own Python file and passing all of these
as individual variables.

Only half of these make use of Flask forms and I could probably pass
the FlaskForm from the route page if needed.
"""
