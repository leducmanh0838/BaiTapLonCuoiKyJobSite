#  app.tests.test_serializers.test_job_posting_serializer.JobPostingSerializerTest
from django.test import TestCase
from app.models import JobPosting, Tag, User
from datetime import datetime

from app.serializers.job_posting_serializer import JobPostingSerializer, JobPostingCreateSerializer


class JobPostingSerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(username="owner")
        # tạo job posting
        self.job_posting = JobPosting.objects.create(
            owner=self.user,
            title="Lập trình viên Python",
            description="Viết API bằng Django",
            salary='Thỏa thuận',
            experience="1 năm",
            address="Đường abc",
            city_code=1,
            district_code=1,
            ward_code=1,
            deadline=datetime(2025, 12, 31, 0, 0, 0),
            is_active=True,
        )
        self.tag1 = Tag.objects.create(name="Lập trình")
        self.tag2 = Tag.objects.create(name="Giao tiếp")
        self.job_posting.tags.add(self.tag1, self.tag2)

    def test_serializer_success(self):
        serializer = JobPostingSerializer(instance=self.job_posting)
        data = serializer.data

        # kiểm tra field cơ bản
        self.assertEqual(data["id"], self.job_posting.id)
        self.assertEqual(data["title"], "Lập trình viên Python")
        self.assertEqual(data["salary"], 'Thỏa thuận')
        self.assertEqual(data["deadline"], "2025-12-31T00:00:00Z")

        self.assertIn("tags", data)
        self.assertEqual(set(data["tags"]), {"Lập trình", "Giao tiếp"})

    def test_missing_title(self):
        data = JobPostingSerializer(self.job_posting).data
        data.pop("title", None)  # loại bỏ field title

        # Khởi tạo serializer với dữ liệu thiếu title
        serializer = JobPostingSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("title", serializer.errors)
        print(serializer.errors)

    def test_title_max_length(self):
        long_title = "a" * 101

        data = JobPostingSerializer(self.job_posting).data
        data["title"] = long_title  # gán title quá dài

        serializer = JobPostingSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("title", serializer.errors)
        print(serializer.errors)

    def test_description_sanitization(self):
        malicious_html = """
            <p>Safe paragraph</p>
            <script>alert('Hacked!');</script>
            <img src="x" onerror="alert('Hacked!')">
            <a href="http://example.com" onclick="evil()">Link</a>
        """

        data = JobPostingCreateSerializer(self.job_posting).data
        data["description"] = malicious_html

        serializer = JobPostingCreateSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        cleaned_description = serializer.validated_data["description"]

        # Kiểm tra các mã độc đã bị loại bỏ
        self.assertNotIn("<script>", cleaned_description)
        self.assertNotIn("onerror", cleaned_description)
        self.assertNotIn("onclick", cleaned_description)

        # Kiểm tra các thẻ được phép vẫn còn
        self.assertIn("<p>Safe paragraph</p>", cleaned_description)
        self.assertIn('<a href="http://example.com">Link</a>', cleaned_description)

        print(cleaned_description)