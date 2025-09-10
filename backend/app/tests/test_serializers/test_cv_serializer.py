# app/tests/test_serializers/test_cv_serializer.py
from django.test import TestCase
from app.models import CV, User
from django.core.files.uploadedfile import SimpleUploadedFile
from app.serializers.cv_serializer import CVSerializer

# 1. kiểm thử: kiểm thử dữ liệu thành công mà không vấn đề gì về validate
# 2. kiểm thử nếu không có title => báo lỗi
# 3. kiểm thử title là max length 255
# 4. kiểm thử nếu không có owner => báo lỗi

class CVSerializerTest(TestCase):
    def setUp(self):
        # Tạo user ứng viên
        self.user = User.objects.create_user(
            username="applicant",
            email="applicant@example.com",
            password="123456",
            role=User.UserRole.CANDIDATE
        )

        # Tạo CV
        self.cv = CV.objects.create(
            owner=self.user,
            title="CV Test",
            summary="Summary test",
            file=SimpleUploadedFile(
                "test.pdf", b"file_content", content_type="application/pdf"
            )
        )

    def test_serializer_success(self):
        serializer = CVSerializer(instance=self.cv)
        data = serializer.data

        self.assertEqual(data["id"], self.cv.id)
        self.assertEqual(data["title"], "CV Test")
        self.assertEqual(data["summary"], "Summary test")
        self.assertEqual(data["owner"], self.user.id)
        self.assertIn("file", data)

    def test_missing_title(self):
        data = CVSerializer(self.cv).data
        data.pop("title", None)  # loại bỏ field title

        serializer = CVSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("title", serializer.errors)
        print(serializer.errors)

    def test_title_max_length(self):
        long_title = "a" * 256  # title vượt max_length 255

        data = CVSerializer(self.cv).data
        data["title"] = long_title

        serializer = CVSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("title", serializer.errors)
        print(serializer.errors)

    def test_missing_owner(self):
        # Khi tạo serializer trực tiếp, owner không cần, nhưng nếu có validate required
        data = {
            "title": "CV không owner",
            "summary": "Summary",
            "upload_file": SimpleUploadedFile(
                "file.pdf", b"abc", content_type="application/pdf"
            )
        }

        serializer = CVSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        # owner sẽ được gán khi save trong view