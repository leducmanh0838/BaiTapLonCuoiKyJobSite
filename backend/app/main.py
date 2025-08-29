import os
import django

# Khởi tạo Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings")  # đổi tên_project thành tên project của bạn
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def main():
    # Tạo 3 ứng viên
    for i in range(1, 4):
        username = f"c{i}"
        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                "email": f"{username}@example.com",
                "role": User.UserRole.CANDIDATE,
                "phone": f"090000000{i}",
                "address": f"Địa chỉ ứng viên {i}",
            }
        )
        if created:
            user.set_password("123456")
            user.save()
            print(f"✅ Đã tạo {user}")
        else:
            print(f"⚠️ {user} đã tồn tại")

        # Tạo 3 ứng viên
        for i in range(1, 4):
            username = f"e{i}"
            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    "email": f"{username}@example.com",
                    "role": User.UserRole.EMPLOYER,
                    "phone": f"090000000{i}",
                    "address": f"Địa chỉ ứng viên {i}",
                }
            )
            if created:
                user.set_password("123456")
                user.save()
                print(f"✅ Đã tạo {user}")
            else:
                print(f"⚠️ {user} đã tồn tại")


if __name__ == "__main__":
    main()
