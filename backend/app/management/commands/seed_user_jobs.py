from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from faker import Faker
import random
from datetime import timedelta
from django.utils import timezone

from app.models import JobPosting  # đổi app.models thành app chứa JobPosting

User = get_user_model()


class Command(BaseCommand):
    help = "Tạo 20 JobPosting cho một user theo id (phải có role=EMPLOYER)"

    def add_arguments(self, parser):
        parser.add_argument("user_id", type=int, help="ID của user (nhà tuyển dụng)")

    def handle(self, *args, **kwargs):
        fake = Faker("vi_VN")
        user_id = kwargs["user_id"]

        try:
            user = User.objects.get(id=user_id, role=User.UserRole.EMPLOYER)
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR("❌ Không tìm thấy nhà tuyển dụng với ID này"))
            return

        for i in range(20):
            job = JobPosting.objects.create(
                is_active=True,
                owner=user,
                company_name=fake.company(),
                title=fake.job(),
                description=fake.paragraph(nb_sentences=5),
                salary=f"{random.randint(8, 50)} triệu/tháng",
                experience=random.choice(["1 năm", "2 năm", "3 năm", "5 năm", "10 năm", "không yêu cầu"]),
                address=fake.address(),
                city_code=random.randint(1, 63),  # giả sử 1-63 là các tỉnh VN
                deadline=timezone.now() + timedelta(days=random.randint(30, 90)),
            )
            self.stdout.write(self.style.SUCCESS(f"✅ Đã tạo job {i + 1}: {job.title}"))

        self.stdout.write(self.style.SUCCESS(f"🎉 Hoàn tất: 20 jobs cho user {user.username}"))
