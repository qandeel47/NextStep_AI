from django.urls import include, path
from rest_framework.routers import DefaultRouter

from counselor.api.viewsets import ConversationViewSet

router = DefaultRouter()
router.register(r'counselor/conversations', ConversationViewSet, basename='counselor-conversation')

urlpatterns = [
    path('', include(router.urls)),
]
