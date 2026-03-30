from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Name default 'first_name' aur 'last_name' mein hota hai, 
    # par hum 'full_name' field bhi le sakte hain.
    phone_number = models.CharField(max_length=15, unique=True)
    email = models.EmailField(unique=True)
    
    # Roles define karne ke liye
    is_admin = models.BooleanField(default=False)
    is_student = models.BooleanField(default=True)

    # Phone number ko login ke liye primary banana (Optional, but recommended for your case)
    USERNAME_FIELD = 'phone_number' 
    REQUIRED_FIELDS = ['username', 'email']

    def __str__(self):
        return self.phone_number