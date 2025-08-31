# trong app/views.py

from rest_framework import viewsets, mixins, permissions
from app.models import Application
from app.paginations import DefaultPagination
from app.serializers.application_serializer import ApplicationSerializer, ApplicationUpdateSerializer
from app.permissions import IsApplicationOwner


class ApplicationViewSet(mixins.CreateModelMixin,
                         mixins.ListModelMixin,
                         mixins.RetrieveModelMixin,
                         mixins.UpdateModelMixin,
                         viewsets.GenericViewSet):
    pagination_class = DefaultPagination

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return ApplicationUpdateSerializer
        return ApplicationSerializer

    def get_permissions(self):
        if self.action in ['retrieve', 'update', 'partial_update']:
            return [permissions.IsAuthenticated(), IsApplicationOwner()]

        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return Application.objects.filter(cv__owner=user).order_by('-created_at')

        return Application.objects.none()

    def perform_create(self, serializer):
        serializer.save()