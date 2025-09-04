from django.core.management.base import BaseCommand
from django.core.files import File
from django.contrib.auth import get_user_model
from pathlib import Path
import random
from faker import Faker

from app.models import CV  # đổi app.models thành app chứa model CV

User = get_user_model()

class Command(BaseCommand):
    help = "Tạo 10 CV cho một user theo id"

    def add_arguments(self, parser):
        parser.add_argument("user_id", type=int, help="ID của user (ứng viên)")

    def handle(self, *args, **kwargs):
        fake = Faker("vi_VN")
        user_id = kwargs["user_id"]

        try:
            user = User.objects.get(id=user_id, role=User.UserRole.CANDIDATE)
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR("❌ Không tìm thấy ứng viên với ID này"))
            return

        pdf_dir = Path("media/cvs")  # thư mục chứa file pdf
        pdf_files = [pdf_dir / f"{i}.pdf" for i in range(1, 10)]

        for i in range(10):
            pdf_path = random.choice(pdf_files)
            if pdf_path.exists():
                with open(pdf_path, "rb") as f:
                    cv = CV.objects.create(
                        owner=user,
                        title=f"{fake.job()} #{i+1}",
                        summary=fake.text(max_nb_chars=300),
                        file=File(f, name=f"user{user.id}_cv{i+1}.pdf")
                    )
                    self.stdout.write(self.style.SUCCESS(f"✅ CV {i+1} tạo cho {user.username}: {cv.title}"))
            else:
                self.stdout.write(self.style.WARNING(f"⚠️ Không tìm thấy file {pdf_path}"))
