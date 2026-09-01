from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .viewsets import UniversityViewSet

router = DefaultRouter()
router.register(r'universities', UniversityViewSet, basename='universities')

urlpatterns = [
    path('', include(router.urls)),
]
