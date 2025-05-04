
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
        ("DMD2", "https://images-ng.pixai.art/images/thumb/2b190ee7-56a3-4f8c-a550-bb525649c3b4"),  # noqa
        ("LCM", "https://images-ng.pixai.art/images/orig/85e1e38f-9cc7-4325-b91a-3d6ec07ce7ea"), # noqa
        ("Bold Outlines", "https://images-ng.pixai.art/images/thumb/a152bd1f-e50f-47cb-8152-e168e62557c1"), # noqa
        ("Vivid Edge", "https://images-ng.pixai.art/images/orig/377a7899-3d6a-4668-a610-42cd5837d98c"), # noqa
        ("Vivid Soft", "https://images-ng.pixai.art/images/orig/cf311f69-2eb5-4207-8bad-647013bd7234"), # noqa
        ("Cartoony", "https://images-ng.pixai.art/images/orig/99e5e2c6-34cf-4175-8464-654821193c71") # noqa
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
