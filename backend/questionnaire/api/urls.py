from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .viewsets import QuestionViewSet, QuestionnaireAnswersViewSet

router = DefaultRouter()
router.register(r'questions', QuestionViewSet, basename='questions')

urlpatterns = [
    path(
        'questionnaire/answers/',
        QuestionnaireAnswersViewSet.as_view({'get': 'list', 'post': 'create'}),
        name='questionnaire-answers',
    ),
    path('', include(router.urls)),
]
