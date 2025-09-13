from types import SimpleNamespace

from django.test import TestCase
from app.models import JobPosting, Tag, User, Application, CV
from datetime import datetime

from app.serializers.application_serializer import ApplicationSerializer


class ApplicationSerializerTest(TestCase):
    def setUp(self):
        self.candidate = User.objects.create_user(
            username="candidate", password="123456", role=User.UserRole.CANDIDATE
        )
        self.employer = User.objects.create_user(
            username="employer", password="123456", role=User.UserRole.EMPLOYER
        )

        self.candidate_cv = CV.objects.create(owner=self.candidate, title="Candidate CV")

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

        self.application = Application.objects.create(cv=self.candidate_cv, job_posting=self.job_posting)

        self.valid_payload = {
            'cv': self.candidate_cv.id,
            'job_posting': self.job_posting.id
        }

    def test_serializer_success_with_valid_data(self):
        mock_request = SimpleNamespace(user=self.candidate)
        context = {'request': mock_request}

        serializer = ApplicationSerializer(data=self.valid_payload, context=context)

        self.assertTrue(serializer.is_valid(), serializer.errors)
        print("\n>>> Test serializer success: PASSED")


    def test_status_defaults_to_pending(self):
        mock_request = SimpleNamespace(user=self.candidate)
        context = {'request': mock_request}

        serializer = ApplicationSerializer(data=self.valid_payload, context=context)
        self.assertTrue(serializer.is_valid())

        application = serializer.save(job_posting=self.job_posting)

        self.assertEqual(application.status, Application.ApplicationStatus.PENDING)
        print(f"\n📝 Test default status: PASSED (Default status is '{application.status}')")


    def test_missing_owner_cv_raises_error(self):
        invalid_payload = {
            'job_posting': self.job_posting.id
        }

        serializer = ApplicationSerializer(data=invalid_payload)

        self.assertFalse(serializer.is_valid())
        self.assertIn('cv', serializer.errors)
        print(f"\n❌ Test missing owner (cv): PASSED. Errors: {serializer.errors}")
