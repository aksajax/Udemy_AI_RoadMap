from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    # Admin list view mein kya-kya dikhega
    list_display = ('phone_number', 'username', 'email', 'is_admin', 'is_staff')
    
    # User details edit karte waqt phone number field dikhane ke liye
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('phone_number', 'is_admin')}),
    )
    
    # Naya user banate waqt phone number mangne ke liye
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('phone_number', 'is_admin')}),
    )

admin.site.register(User, CustomUserAdmin)