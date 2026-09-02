from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .viewsets import CareerFieldViewSet, RecommendationViewSet

router = DefaultRouter()
router.register(r'fields', CareerFieldViewSet, basename='fields')
router.register(r'recommendations', RecommendationViewSet, basename='recommendations')

urlpatterns = [
    path('', include(router.urls)),
]
