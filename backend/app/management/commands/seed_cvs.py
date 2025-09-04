from django.core.management.base import BaseCommand
from django.core.files import File
from django.contrib.auth import get_user_model
from pathlib import Path
import random
from faker import Faker

from app.models import CV  # đổi app.models thành app chứa model CV

User = get_user_model()

class Command(BaseCommand):
    help = "Seed fake CVs cho các candidate"

    def handle(self, *args, **kwargs):
        fake = Faker("vi_VN")

        # Lấy tất cả user có role = CANDIDATE
        candidates = User.objects.filter(role=User.UserRole.CANDIDATE)
        if not candidates.exists():
            self.stdout.write(self.style.ERROR("❌ Không tìm thấy ứng viên nào"))
            return

        pdf_dir = Path("media/cvs")  # thư mục chứa file pdf
        pdf_files = [pdf_dir / f"{i}.pdf" for i in range(1, 8)]

        for candidate in candidates:
            # Mỗi candidate có 1-2 CV ngẫu nhiên
            for _ in range(random.randint(1, 2)):
                pdf_path = random.choice(pdf_files)
                if pdf_path.exists():
                    with open(pdf_path, "rb") as f:
                        cv = CV.objects.create(
                            owner=candidate,
                            title=fake.job(),
                            summary=fake.text(max_nb_chars=300),
                            file=File(f, name=pdf_path.name)  # gắn file từ media
                        )
                        self.stdout.write(self.style.SUCCESS(f"✅ CV tạo cho {candidate.username}: {cv.title}"))
                else:
                    self.stdout.write(self.style.WARNING(f"⚠️ Không tìm thấy file {pdf_path}"))
