import os
import django
import random

from django.core.files import File
from django.utils import timezone
from datetime import timedelta
from django.core.files.base import ContentFile

# setup Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings")
django.setup()

from app.models import User, CV, JobPosting, Application


def run():
    # Xoá dữ liệu cũ để test lại
    Application.objects.all().delete()
    JobPosting.objects.all().delete()
    CV.objects.all().delete()
    User.objects.exclude(is_superuser=True).delete()

    # Tạo 3 ứng viên
    candidates = []
    for i in range(1, 4):
        user = User.objects.create_user(
            username=f"a{i}",
            password="123456",
            role=User.UserRole.CANDIDATE,
            email=f"a{i}@test.com"
        )
        candidates.append(user)
        print("Tạo ứng viên:", user.username)

    # Tạo 3 nhà tuyển dụng
    employers = []
    for i in range(1, 4):
        user = User.objects.create_user(
            username=f"e{i}",
            password="123456",
            role=User.UserRole.EMPLOYER,
            email=f"e{i}@test.com"
        )
        employers.append(user)
        print("Tạo nhà tuyển dụng:", user.username)

    # Mỗi ứng viên tạo 2 CV
    pdf_files = ["1.pdf", "2.pdf", "3.pdf"]  # danh sách file pdf thật có sẵn
    for candidate in candidates:
        for j in range(2):  # mỗi ứng viên tạo 2 CV
            pdf_path = os.path.join(os.path.dirname(__file__), pdf_files[j % len(pdf_files)])
            with open(pdf_path, "rb") as f:
                cv = CV.objects.create(
                    owner=candidate,
                    title=f"CV {candidate.username} - {j + 1}",
                    summary="Demo CV content",
                    file=File(f, name=f"{candidate.username}_cv{j + 1}.pdf")
                )
            print("Tạo CV:", cv.title)

    # Tạo 10 jobposting
    job_postings = []
    for i in range(1, 11):
        employer = random.choice(employers)
        job = JobPosting.objects.create(
            is_active=True,
            owner=employer,
            title=f"Job {i} - {employer.username}",
            description="Mô tả công việc",
            image="https://placehold.co/600x400",
            salary=f"{random.randint(5,15)} triệu",
            experience="1-2 năm",
            address="Hà Nội",
            city_code=1,
            deadline=timezone.now() + timedelta(days=30)
        )
        job_postings.append(job)
        print("Tạo Job:", job.title)

    # Tạo 10 application (ngẫu nhiên)
    cvs = list(CV.objects.all())
    for i in range(10):
        job = random.choice(job_postings)
        cv = random.choice(cvs)
        app = Application.objects.create(
            job_posting=job,
            cv=cv,
            status=random.choice([s[0] for s in Application.ApplicationStatus.choices])
        )
        print(f"Tạo Application: {cv.owner.username} nộp vào {job.title} - status={app.status}")


if __name__ == "__main__":
    User.objects.get(id=192).delete()
