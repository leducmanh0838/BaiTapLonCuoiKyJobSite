from rest_framework import serializers

from app.models import JobPosting, Application
from app.serializers.user_serializer import UserAvatarAndName


class JobPostingSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPosting
        fields = ["id", "is_active", "owner", "title",
                  "description", "image", "salary",
                  "experience", "address", "city_code",
                  "deadline"]
        read_only_fields = ["id", "is_active", "owner", "image"]


class JobPostingApplicationSerializer(serializers.ModelSerializer):
    cv_owner = UserAvatarAndName(source="cv.owner", read_only=True)
    cv_file = serializers.URLField(source="cv.file", read_only=True)

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