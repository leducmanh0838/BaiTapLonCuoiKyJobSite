from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from faker import Faker
import random

User = get_user_model()

class Command(BaseCommand):
    help = "Seed fake users (candidates & employers)"

    def handle(self, *args, **kwargs):
        fake = Faker('vi_VN')  # dùng tiếng Việt
        avatar_ids = [
            "media/job-postings/trung-chien-thom-ngon-on-gian_4_gmqatv", "media/avatars/1_d2p206",
            "avatars/cit8q9w0wbddlvwzzt9t",
            "avatars/hvqtshmmh5zeu8nhnioq", "lceipgvduex25atdkdu6",
            "recipes/20250822012716_242e986c",
            "recipes/20250822135436_c317b9fd",
        ]

        # Sinh 300 CANDIDATE
        for _ in range(150):
            username = fake.unique.user_name()
            email = f"{username}@example.com"
            user = User.objects.create_user(
                username=username,
                email=email,
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                password="123456",  # password mặc định
                role=User.UserRole.CANDIDATE,
                phone=fake.phone_number(),
                avatar=random.choice(avatar_ids)
            )
            self.stdout.write(self.style.SUCCESS(f"user_id={user.id}"))

        # Sinh 50 EMPLOYER
        for _ in range(20):
            username = fake.unique.user_name()
            email = f"{username}@example.com"
            user=User.objects.create_user(
                username=username,
                email=email,
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                password="123456",
                role=User.UserRole.EMPLOYER,
                phone=fake.phone_number(),
                avatar=random.choice(avatar_ids)
            )
            self.stdout.write(self.style.SUCCESS(f"user_id={user.id}"))

        self.stdout.write(self.style.SUCCESS("✅ Đã tạo 300 CANDIDATE và 50 EMPLOYER"))
