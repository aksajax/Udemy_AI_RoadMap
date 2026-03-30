from rest_framework import serializers
from .models import Course, Section, Lecture



class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        # Sirf wahi fields jo aapke 'Course' model mein hain
        fields = ['id', 'title', 'thumbnail', 'description', 'created_at']
        extra_kwargs = {
            'thumbnail': {'required': False}, # Isse thumbnail optional ho jayega
        }

#U Courses --> List of Course
class LectureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lecture
        fields = ['id', 'title', 'video_url', 'content', 'order']

class SectionSerializer(serializers.ModelSerializer):
    lectures = LectureSerializer(many=True, read_only=True) # Nested Lectures

    class Meta:
        model = Section
        fields = ['id', 'title', 'order', 'lectures']

class CourseDetailSerializer(serializers.ModelSerializer):
    sections = SectionSerializer(many=True, read_only=True) # Nested Sections

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'thumbnail', 'sections']