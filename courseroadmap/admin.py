from django.contrib import admin
from .models import Course, Section, Lecture # Models import karein

# Models ko register karein
admin.site.register(Course)
admin.site.register(Section)
admin.site.register(Lecture)