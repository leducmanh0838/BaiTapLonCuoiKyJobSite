from rest_framework import serializers

from app.models import CV


class CVSerializer(serializers.ModelSerializer):
    upload_file = serializers.FileField(write_only=True, required=False)

    class Meta:
        model = CV
        fields = ["id", "owner", "title", "summary", "file", "upload_file"]
        read_only_fields = ["id", "owner", "file"]

    def create(self, validated_data):
        upload_file = validated_data.pop('upload_file', None)
        if upload_file:
            validated_data["file"] = upload_file
        return super().create(validated_data)

    def update(self, instance, validated_data):
        upload_file = validated_data.pop('upload_file', None)
        if upload_file:
            instance.file = upload_file
        return super().update(instance, validated_data)
