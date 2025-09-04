from django.core.management.base import BaseCommand
import random
from faker import Faker

from app.models import Application, JobPosting, CV  # đổi app.models thành app chứa models của bạn

class Command(BaseCommand):
    help = "Tạo dữ liệu Application (ứng tuyển) ngẫu nhiên cho mỗi JobPosting"

    def handle(self, *args, **kwargs):
        fake = Faker("vi_VN")

        cvs = list(CV.objects.all())
        if not cvs:
            self.stdout.write(self.style.ERROR("❌ Không có CV nào trong hệ thống"))
            return

        job_postings = JobPosting.objects.all()
        if not job_postings.exists():
            self.stdout.write(self.style.ERROR("❌ Không có JobPosting nào trong hệ thống"))
            return

        total_apps = 0

        for job in job_postings:
            # random số lượng CV apply cho job này
            num_applications = random.randint(0, len(cvs))
            chosen_cvs = random.sample(cvs, num_applications) if num_applications > 0 else []

            for cv in chosen_cvs:
                app, created = Application.objects.get_or_create(
                    job_posting=job,
                    cv=cv,
                    defaults={
                        "is_cancel": False,
                        "status": random.choice([s[0] for s in Application.ApplicationStatus.choices])
                    }
                )
                if created:
                    total_apps += 1

            self.stdout.write(self.style.SUCCESS(
                f"💼 Job '{job.title}' nhận {num_applications} hồ sơ"
            ))

        self.stdout.write(self.style.SUCCESS(f"🎉 Đã tạo tổng cộng {total_apps} ứng tuyển"))
