from rest_framework import viewsets, mixins
from rest_framework.permissions import AllowAny

from app.models import Tag
from app.serializers.tag_serializer import TagSerializer


class TagViewSet(mixins.ListModelMixin,
                        viewsets.GenericViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [AllowAny]