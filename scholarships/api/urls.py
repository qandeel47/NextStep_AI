from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .viewsets import ScholarshipViewSet

router = DefaultRouter()
router.register(r'scholarships', ScholarshipViewSet, basename='scholarships')

urlpatterns = [
    path('', include(router.urls)),
]
