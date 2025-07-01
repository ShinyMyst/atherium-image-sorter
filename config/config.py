COLLECTIONS = {
    "gallery": 'Gallery',
    "test": 'Test',
    'llamas': 'Test2'
}

MODELS = [
    'Hoshino',
    'Hakura',
    'Hoseki',
    'Otome',
    'Tsubaki',
    'AniKawaXL',
    'KonpaEvo',
    'KiwiMix-XL'
]

LORAS = {
    "DMD2": {
        "img_url": "https://images-ng.pixai.art/images/thumb/2b190ee7-56a3-4f8c-a550-bb525649c3b4" # noqa
    },
    "LCM": {
        "img_url": "https://images-ng.pixai.art/images/orig/85e1e38f-9cc7-4325-b91a-3d6ec07ce7ea" # noqa
    },
    "Bold Outlines": {
        "img_url": "https://images-ng.pixai.art/images/thumb/a152bd1f-e50f-47cb-8152-e168e62557c1" # noqa
    },
    "Vivid Edge": {
        "img_url": "https://images-ng.pixai.art/images/orig/377a7899-3d6a-4668-a610-42cd5837d98c" # noqa
    },
    "Vivid Soft": {
        "img_url": "https://images-ng.pixai.art/images/orig/cf311f69-2eb5-4207-8bad-647013bd7234" # noqa
    },
    "Cartoony": {
        "img_url": "https://images-ng.pixai.art/images/orig/99e5e2c6-34cf-4175-8464-654821193c71" # noqa
    }
}

SAMPLING_METHODS = [
    'Euler A',
    'Euler',
    'DDIM',
    'LMS'
]

# Quick Entry pulls full model or LoRA Name
# This replaces it with the shortened version
QUICK_SUBSTITUTION = {
    "LCM&TurboMix LoRA (eular a.fix) XL": "LCM",
    "Otome v2": "Otome"
}

"""
TODO - A better method would be to ALWAYS store the full name in JSON, and
then use a dictionary to determines what text is displayed on the webpage.
However, it will take a significant refactor in multiple areas to make it
function like that.  This is a quick bandaid to make sure things are func.
"""

# TODO - JSON Keys should also be here for consistency everywhere
