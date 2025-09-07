from rest_framework import serializers

from app.models import JobPosting, Application, Tag
from app.serializers.tag_serializer import TagNameSerializer
from app.serializers.user_serializer import UserAvatarAndNameSerializer


class JobPostingSerializer(serializers.ModelSerializer):
    tags = TagNameSerializer(many=True, read_only=True)

    class Meta:
        model = JobPosting
        fields = ["id", "is_active", "owner", "title",
                  "description", "image", "salary",
                  "experience", "address", "city_code",
                  "deadline", "tags"]
        read_only_fields = ["id", "is_active", "owner"]


class JobPostingCreateSerializer(serializers.ModelSerializer):
    # tags = TagNameSerializer(many=True, read_only=True)
    tags = serializers.ListField(
        child=serializers.CharField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = JobPosting
        fields = ["id", "is_active", "owner", "title",
                  "description", "image", "salary",
                  "experience", "address", "city_code",
                  "deadline", "tags"]
        read_only_fields = ["id", "is_active", "owner"]

    def create(self, validated_data):
        tags_data = validated_data.pop("tags", [])
        job = JobPosting.objects.create(**validated_data)

        # Lấy tag từ DB theo tên
        tag_objs = Tag.objects.filter(name__in=tags_data)
        job.tags.set(tag_objs)
        return job

    def update(self, instance, validated_data):
        tags_data = validated_data.pop("tags", None)
        print("tags_data: ", tags_data)

        # Cập nhật các field thông thường
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Nếu có tags trong request, xoá cũ và gán mới
        if tags_data is not None:
            tag_objs = Tag.objects.filter(name__in=tags_data)
            instance.tags.set(tag_objs)

        return instance


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
