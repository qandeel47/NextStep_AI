"""
URL configuration for config project.
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)
from rest_framework.permissions import AllowAny

from config.views import health_check
from users.api.token_views import TaggedTokenRefreshView

urlpatterns = [
    path('health/', health_check, name='health-check'),
    path('admin/', admin.site.urls),
    path('api/', include('users.api.urls')),
    path('api/', include('userprofile.api.urls')),
    path('api/', include('questionnaire.api.urls')),
    path('api/', include('universities.api.urls')),
    path('api/', include('careerfields.api.urls')),
    path('api/', include('scholarships.api.urls')),
    path('api/', include('counselor.api.urls')),

    path('api/token/refresh/', TaggedTokenRefreshView.as_view(), name='token_refresh'),

    path(
        'api/schema/',
        SpectacularAPIView.as_view(permission_classes=[AllowAny]),
        name='schema',
    ),
    path(
        'api/docs/',
        SpectacularSwaggerView.as_view(url_name='schema', permission_classes=[AllowAny]),
        name='swagger-ui',
    ),
    path(
        'redoc/',
        SpectacularRedocView.as_view(url_name='schema', permission_classes=[AllowAny]),
        name='redoc',
    ),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
