from rest_framework import mixins, viewsets
from rest_framework.permissions import IsAuthenticated

from app.models import CV
from app.paginations import DefaultPagination
from app.permissions import IsOwner
from app.serializers.cv_serializer import CVSerializer


class CVViewSet(mixins.ListModelMixin,
                        mixins.RetrieveModelMixin,
                        mixins.UpdateModelMixin,
                        mixins.CreateModelMixin,
                        mixins.DestroyModelMixin,
                        viewsets.GenericViewSet):
    pagination_class = DefaultPagination
    serializer_class = CVSerializer

    def get_permissions(self):
        if self.action in ['list', 'create']:
            return [IsAuthenticated()]
        elif self.action in ['update', 'partial_update', 'destroy', 'retrieve']:
            return [IsOwner()]
        else:
            return [IsAuthenticated()]

    def get_queryset(self):
        return CV.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)