from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

# --- Helper function to generate tokens manually ---
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    
    # Token ke payload mein admin status manually add karein
    refresh['is_admin'] = user.is_admin 
    refresh['is_staff'] = user.is_staff
    
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    data = request.data
    try:
        # Check if phone number already exists
        if User.objects.filter(phone_number=data['phone_number']).exists():
            return Response({"detail": "Phone number already registered"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            username=data['username'],
            email=data['email'],
            password=data['password'],
            phone_number=data['phone_number'],
            is_admin=data.get('is_admin', False) # Default student rahega
        )
        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    phone = request.data.get('phone_number')
    password = request.data.get('password')

    # Phone number se user dhoondna (Custom Backend logic)
    try:
        user = User.objects.get(phone_number=phone)
        if user.check_password(password):
            tokens = get_tokens_for_user(user)
            return Response({
                'access': tokens['access'],
                'refresh': tokens['refresh'],
                'username': user.username,
                'is_admin': user.is_admin, # Role base logic ke liye zaroori hai
                'message': 'Login Successful'
            }, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Invalid Password"}, status=status.HTTP_401_UNAUTHORIZED)
    except User.DoesNotExist:
        return Response({"detail": "User with this phone number not found"}, status=status.HTTP_404_NOT_FOUND)