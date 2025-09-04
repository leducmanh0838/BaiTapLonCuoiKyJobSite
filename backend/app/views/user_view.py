from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from app.serializers.user_serializer import UserSerializer


class UserViewSet(mixins.CreateModelMixin,
                        viewsets.GenericViewSet):
    serializer_class = UserSerializer
    def get_permissions(self):
        if self.action in ['current_user']:
            return [IsAuthenticated()]
        return [AllowAny()]

    @action(methods=['get'], url_path='current-user', detail=False)
    def current_user(self, request):
        return Response(UserSerializer(request.user).data)