from rest_framework import serializers

from app.models import User


class UserAvatarAndNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "avatar"]