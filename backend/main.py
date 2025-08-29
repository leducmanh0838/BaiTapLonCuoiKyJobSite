import django
import os

# Cấu hình Django nếu chạy file độc lập
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
django.setup()

from django.core.mail import send_mail

def main():
    try:
        send_mail(
            subject="Test Email Django",
            message="Chào bạn! Đây là email test gửi từ Django.",
            from_email=None,  # sẽ dùng DEFAULT_FROM_EMAIL
            recipient_list=["2251012090manh@ou.edu.vn"],  # email người nhận
            fail_silently=False,
        )
        print("Email đã được gửi thành công!")
    except Exception as e:
        print("Gửi email thất bại:", e)

if __name__ == "__main__":
    main()
