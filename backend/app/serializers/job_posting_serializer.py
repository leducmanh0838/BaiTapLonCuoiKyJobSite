import bleach
from rest_framework import serializers
import json

from app.models import JobPosting, Application, Tag
from app.serializers.tag_serializer import TagNameSerializer
from app.serializers.user_serializer import UserAvatarAndNameSerializer


class EmployerJobPostingSerializer(serializers.ModelSerializer):
    unread_applications_count = serializers.SerializerMethodField()

    class Meta:
        model = JobPosting
        fields = [
            "id", "is_active", "owner", "title", "company_name",
            "image", "salary", "experience", "address", "city_code",
            "district_code", "ward_code", "deadline",
            "unread_applications_count",  # 👈 thêm field mới
        ]
        read_only_fields = ["id", "is_active", "owner"]

    def get_unread_applications_count(self, obj):
        return obj.applications.filter(is_read=False, is_cancel=False).count()


class JobPostingSerializer(serializers.ModelSerializer):
    tags = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field="name"
    )

    class Meta:
        model = JobPosting
        fields = ["id", "is_active", "owner", "title", "company_name",
                  "description", "image", "salary",
                  "experience", "address", "city_code",
                  "district_code", "ward_code",
                  "deadline", "tags"]
        read_only_fields = ["id", "is_active", "owner"]


class JobPostingCreateSerializer(serializers.ModelSerializer):
    # tags = TagNameSerializer(many=True, read_only=True)
    tags = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = JobPosting
        fields = ["id", "is_active", "owner", "title", "company_name",
                  "description", "image", "salary",
                  "experience", "address", "city_code",
                  "district_code", "ward_code",
                  "deadline", "tags"]
        read_only_fields = ["id", "is_active", "owner"]

    def validate_tags(self, value):
        """Parse JSON string thành list"""
        try:
            tags = json.loads(value) if value else []
        except Exception:
            raise serializers.ValidationError("Tags phải là JSON hợp lệ")
        if not isinstance(tags, list):
            raise serializers.ValidationError("Tags phải là list")
        return tags

    def validate_description(self, value):
        # Chỉ cho phép một số thẻ và thuộc tính HTML an toàn
        allowed_tags = [
            "p", "b", "i", "u", "em", "strong", "a",
            "ul", "ol", "li", "br", "span"
        ]
        allowed_attrs = {
            "a": ["href", "title", "target"],
            "span": ["style"],
        }

        cleaned_value = bleach.clean(
            value,
            tags=allowed_tags,
            attributes=allowed_attrs,
            strip=True
        )
        return cleaned_value

    def create(self, validated_data):
        tags_data = validated_data.pop("tags", [])
        print("tags_data: ", tags_data)
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


class JobPosingMessageSerializer(serializers.Serializer):
    message = serializers.CharField()
    statuses = serializers.ListField(
        child=serializers.ChoiceField(choices=Application.ApplicationStatus.choices),
        required=False
    )