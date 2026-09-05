from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import viewsets

router = DefaultRouter()
router.register(r'register', viewsets.UserRegistration, basename='register')
router.register(r'login', viewsets.UserLogin, basename='login')
router.register(r'me', viewsets.UserProfile, basename='me')
router.register(r'logout', viewsets.Logout, basename='logout')

urlpatterns = [
    path(
        'change-password/',
        viewsets.UserProfile.as_view({'post': 'change_password'}),
        name='change-password',
    ),
    path('', include(router.urls)),
]