from rest_framework import serializers

from app.models import Tag


class TagNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name"]
