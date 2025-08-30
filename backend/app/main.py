def user():
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
    import os
    import django

    # Khởi tạo Django environment
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings")  # đổi tên_project thành tên project của bạn
    django.setup()

    from django.contrib.auth import get_user_model

    User = get_user_model()
    from app.models import Application, CV, JobPosting

    job_posting = JobPosting.objects.get(id=9)

    for cv_id in range(1, 11):  # CV id từ 1 đến 10
        cv = CV.objects.get(id=cv_id)
        Application.objects.create(
            job_posting=job_posting,
            owner=cv.owner,  # lấy user từ CV
        )
    print("Đã tạo xong 10 Application cho job_posting=10")

