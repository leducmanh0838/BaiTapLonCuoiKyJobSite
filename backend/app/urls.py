from rest_framework_nested import routers
from django.urls import path, include


# from app.views.cv_view import CVViewSet

router = routers.SimpleRouter()

urlpatterns = [
    path('', include(router.urls)),
]