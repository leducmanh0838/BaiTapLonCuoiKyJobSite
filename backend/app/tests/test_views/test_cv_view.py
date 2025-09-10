from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from app.models import CV, User


# 1. Xem danh sách thành công trả về 200
# 2. Xem chi tiết thành công trả về 200
# 3. Tạo cv thành công trả về 201
# 4. Chỉnh sửa cv thành công trả về 200
# 5. Xóa cv thành công trả về 204

class CVViewSetTest(APITestCase):

    def setUp(self):
        # Tạo user
        self.user = User.objects.create_user(
            username="owner",
            email="owner@example.com",
            password="123456",
            role=User.UserRole.CANDIDATE
        )
        self.client.login(username="owner", password="123456")

        # Tạo CV
        self.cv = CV.objects.create(
            owner=self.user,
            title="Test CV",
            summary="Summary test"
        )

        # Endpoint
        self.list_url = reverse("cvs-list")
        self.detail_url = reverse("cvs-detail", args=[self.cv.id])

    def test_list_cvs(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_retrieve_cv(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], self.cv.title)

    def test_create_cv_invalid(self):
        # title missing
        data = {
            "summary": "No title CV",
            "upload_file": SimpleUploadedFile("test.pdf", b"file_content", content_type="application/pdf")
        }
        response = self.client.post(self.list_url, data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_cv(self):
        data = {
            "title": "Updated CV",
            "summary": "Updated summary"
        }
        response = self.client.patch(self.detail_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.cv.refresh_from_db()
        self.assertEqual(self.cv.title, "Updated CV")

    def test_delete_cv(self):
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(CV.objects.filter(id=self.cv.id).exists())