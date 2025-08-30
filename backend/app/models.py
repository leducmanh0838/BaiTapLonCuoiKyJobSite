from django.contrib.auth.models import AbstractUser
from django.db import models
from rest_framework.exceptions import ValidationError


# Create your models here.

class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class User(AbstractUser):
    class UserRole(models.TextChoices):
        CANDIDATE = 'CANDIDATE', 'Ứng viên'
        EMPLOYER = 'EMPLOYER', 'Nhà tuyển dụng'

    role = models.CharField(
        max_length=20,
        choices=UserRole.choices,
        default=UserRole.CANDIDATE
    )

    avatar = models.URLField(null=True, blank=True)
    phone = models.CharField(max_length=15, null=True)
    address = models.CharField(max_length=500, null=True)

    def __str__(self):
        return self.username


def validate_pdf(file):
    if not file.name.endswith('.pdf'):
        raise ValidationError("Chỉ được upload file PDF.")
    if hasattr(file, "content_type") and file.content_type != 'application/pdf':
        raise ValidationError("File phải có định dạng PDF.")


class CV(TimeStampedModel):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cvs')
    title = models.CharField(max_length=255)
    summary = models.TextField()
    file = models.FileField(upload_to="cvs/", validators=[validate_pdf])


class JobPosting(TimeStampedModel):
    is_active = models.BooleanField(default=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='job_postings')
    title = models.CharField(max_length=100)
    description = models.TextField()
    image = models.URLField()
    salary = models.CharField(max_length=50)
    experience = models.CharField(max_length=50)
    address = models.CharField(max_length=500)
    city_code = models.IntegerField()
    deadline = models.DateTimeField()


class Application(TimeStampedModel):
    class ApplicationStatus(models.TextChoices):
        PENDING = 'PENDING', 'Đang chờ'
        INTERVIEW = 'INTERVIEW', 'Phỏng vấn'
        HIRED = 'HIRED', 'Trúng tuyển'
        REJECTED = 'REJECTED', 'Từ chối'

    job_posting = models.ForeignKey(JobPosting, on_delete=models.CASCADE, related_name='applications')
    cv = models.ForeignKey(CV, on_delete=models.CASCADE, related_name='applications')
    is_cancel = models.BooleanField(default=False)
    status = models.CharField(
        max_length=20,
        choices=ApplicationStatus.choices,
        default=ApplicationStatus.PENDING
    )
