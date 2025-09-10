# app/tests/test_views/test_application_view.py
from datetime import datetime

from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from app.models import User, CV, JobPosting, Application

class ApplicationViewSetTest(APITestCase):
    def setUp(self):
        self.candidate = User.objects.create_user(
            username="candidate", password="123456", role=User.UserRole.CANDIDATE
        )
        self.employer = User.objects.create_user(
            username="employer", password="123456", role=User.UserRole.EMPLOYER
        )

        self.client.login(username="candidate", password="123456")

        # 2. Tạo 1 CV cho ứng viên
        self.candidate_cv = CV.objects.create(owner=self.candidate, title="CV của ứng viên")

        # 3. Tạo 1 Job Posting của nhà tuyển dụng
        self.job_posting = JobPosting.objects.create(
            owner=self.employer,
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

        # 4. Tạo 1 Application ban đầu để test các action retrieve, update
        self.application = Application.objects.create(
            cv=self.candidate_cv, job_posting=self.job_posting
        )

        self.list_url = reverse("applications-list")
        self.detail_url = reverse("applications-detail", args=[self.application.id])

    def test_list_applications_returns_200(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        print("\n✅ Test list applications: PASSED (200 OK)")

    def test_retrieve_application_returns_200(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.application.id)
        print("\n✅ Test retrieve application: PASSED (200 OK)")

    def test_create_application_returns_201(self):
        new_job_posting = JobPosting.objects.create(
            owner=self.employer,
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

        data = {
            "cv": self.candidate_cv.id,
            "job_posting": new_job_posting.id  # Dùng ID, không phải object
        }

        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            Application.objects.filter(cv=self.candidate_cv, job_posting=new_job_posting).exists()
        )
        print("\n✅ Test create application: PASSED (201 Created)")

    def test_cancel_application_successfully(self):
        data = {"is_cancel": True}

        response = self.client.patch(self.detail_url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.application.refresh_from_db()

        self.assertTrue(self.application.is_cancel)
        print("\n✅ Test cancel application: PASSED")