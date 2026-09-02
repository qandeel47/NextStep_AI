from django.urls import path

from .viewsets import AcademicProfileViewSet

urlpatterns = [
    path(
        'profile/',
        AcademicProfileViewSet.as_view({'get': 'list', 'put': 'update'}),
        name='academic-profile',
    ),
]
