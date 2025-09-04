import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings")
django.setup()

from django.core.management import call_command

with open("data.json", "w", encoding="utf-8") as f:
    call_command("dumpdata", indent=2, stdout=f)

# python manage.py loaddata data/data_v1.json