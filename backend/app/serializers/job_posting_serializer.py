from rest_framework import serializers

from app.models import JobPosting, Application
from app.serializers.user_serializer import UserAvatarAndNameSerializer


class JobPostingSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPosting
        fields = ["id", "is_active", "owner", "title",
                  "description", "image", "salary",
                  "experience", "address", "city_code",
                  "deadline"]
        read_only_fields = ["id", "is_active", "owner", "image"]


class JobPostingApplicationSerializer(serializers.ModelSerializer):
    cv_owner = UserAvatarAndNameSerializer(source="cv.owner", read_only=True)
    cv_file = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = [
            "id",
            "job_posting",
            "cv",
            "cv_owner",
            "cv_file",
            "is_cancel",
            "status",
        ]
        read_only_fields = ["id", "job_posting", "cv", "is_cancel"]

    def get_cv_file(self, obj):
        request = self.context.get("request")
        if obj.cv.file and hasattr(obj.cv.file, "url"):
            url = obj.cv.file.url
            return request.build_absolute_uri(url) if request else url
        return None