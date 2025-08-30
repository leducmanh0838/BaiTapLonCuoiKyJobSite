from rest_framework import serializers

from app.models import CV


class CVSerializer(serializers.ModelSerializer):
    upload_file = serializers.FileField(write_only=True, required=True)

    class Meta:
        model = CV
        fields = ["id", "owner", "title",
                  "summary", "file", "upload_file"]
        read_only_fields = ["id", "owner", "file"]

    def create(self, validated_data):
        upload_file = validated_data.pop('upload_file', None)

        if upload_file:
            validated_data["file"] = upload_file

        # Gọi super().create để tạo đối tượng
        return super().create(validated_data)