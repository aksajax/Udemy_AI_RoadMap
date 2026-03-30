from django.db import models
from django.contrib.auth.models import User
# Create your models here.


class Course(models.Model):
    title = models.CharField(max_length=255)
    thumbnail = models.ImageField(upload_to='course_thumbnails/', null=True, blank=True)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Section(models.Model):
    course = models.ForeignKey(Course, related_name='sections', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=0) # Section sequence ke liye

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.course.title} - {self.title}"

class Lecture(models.Model):
    section = models.ForeignKey(Section, related_name='lectures', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    video_url = models.URLField(help_text="YouTube or S3 video link")
    content = models.TextField(blank=True) # Text notes ke liye
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']