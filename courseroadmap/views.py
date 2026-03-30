import os
import json
from dotenv import load_dotenv
from groq import Groq

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser # Image support ke liye

from .models import Course, Section, Lecture
from .serializers import CourseSerializer, CourseDetailSerializer

load_dotenv()

# --- Custom Permission: Check if User is Admin or Staff ---
class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        # GET, HEAD, OPTIONS requests are allowed for everyone
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # POST, PUT, DELETE requires Admin or Staff status
        return request.user.is_authenticated and (
            getattr(request.user, 'is_admin', False) or request.user.is_staff
        )

# --- 1. Course List & Create View ---
class CourseListAPIView(APIView):
    # MultiPartParser is mandatory to receive Image Files from React
    parser_classes = (MultiPartParser, FormParser)

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]

    def get(self, request):
        queryset = Course.objects.all()
        serializer = CourseSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        # Explicit Admin Check
        if not (getattr(request.user, 'is_admin', False) or request.user.is_staff):
            return Response(
                {"detail": "Only admins can create courses."}, 
                status=status.HTTP_403_FORBIDDEN
            )
            
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        # Validation errors (e.g., missing fields)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        try:
            course = Course.objects.get(pk=pk)
            course.delete()
            return Response({"message": "Course deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Course.DoesNotExist:
            return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)


# --- 2. Course Detail, Update & Delete View ---
class CourseDetailAPIView(APIView):
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, pk):
        try:
            # prefetch_related use kiya hai taaki lectures ek baar mein load ho jayein
            course = Course.objects.prefetch_related('sections__lectures').get(pk=pk)
            serializer = CourseDetailSerializer(course)
            return Response(serializer.data)
        except Course.DoesNotExist:
            return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        try:
            course = Course.objects.get(pk=pk)
            # partial=True handle karta hai agar user sirf thumbnail change kare ya sirf title
            serializer = CourseSerializer(course, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Course.DoesNotExist:
            return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            course = Course.objects.get(pk=pk)
            course.delete()
            return Response({"message": "Course deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Course.DoesNotExist:
            return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)


# --- 3. AI Roadmap Generator (Groq Integration) ---
GROQ_KEY = os.getenv("GROQ_API_KEY", "")
client = Groq(api_key=GROQ_KEY)

class GenerateRoadmapView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        topic = request.data.get('topic', '').lower()
        existing_courses = Course.objects.all()
        course_list = [{"id": c.id, "title": c.title} for c in existing_courses]

        if not course_list:
            return Response({"error": "No courses available in database"}, status=status.HTTP_404_NOT_FOUND)

        prompt = f"""
        User wants to learn: "{topic}"
        Available courses in our database: {json.dumps(course_list)}
        
        Task: Pick the MOST relevant Course ID from the list.
        If no course matches even slightly, return "none".
        Respond ONLY with the ID number or "none". No conversational text.
        """

        try:
            chat_completion = client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="llama3-8b-8192", 
                temperature=0.1
            )

            best_match_id = chat_completion.choices[0].message.content.strip().lower()

            if best_match_id == "none" or not best_match_id.isdigit():
                return Response({"message": "No matching course found"}, status=status.HTTP_404_NOT_FOUND)

            return Response({
                "message": "Match Found",
                "course_id": int(best_match_id)
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)