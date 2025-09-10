# app.tests.test_views.test_job_posting_view.JobPostingViewSetTest
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from app.models import JobPosting, User
from datetime import datetime
from django.utils import timezone


class JobPostingViewSetTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="owner", password="123456", role = User.UserRole.EMPLOYER)
        self.client.login(username="owner", password="123456")

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
            deadline=timezone.make_aware(datetime(2025, 12, 31, 0, 0, 0)),
            is_active=True,
        )
        # Endpoint base
        self.list_url = reverse("job-postings-list")  # tên viewset mặc định là 'jobposting'
        self.detail_url = reverse("job-postings-detail", args=[self.job_posting.id])

    def test_list_job_postings(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data["results"]), 1)  # pagination

    def test_retrieve_job_posting(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.job_posting.id)

    def test_create_job_posting(self):
        data = {
            # "owner": self.user.id,
            "title": "Tester Django",
            "description": "Test create job posting",
            "salary": "Thỏa thuận",
            "experience": "0-2 năm",
            "address": "Đường abc",
            "city_code":1,
            "district_code":1,
            "deadline":"2025-12-31T00:00:00Z"
        }
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], data["title"])

    def test_update_job_posting(self):
        data = {"title": "Lập trình viên Django"}
        response = self.client.patch(self.detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.job_posting.refresh_from_db()
        self.assertEqual(self.job_posting.title, data["title"])

    def test_delete_job_posting(self):
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(JobPosting.objects.filter(id=self.job_posting.id).exists())
