from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.module_loading import import_string
from rest_framework.exceptions import ValidationError


# Create your models here.
def get_dynamic_storage():
    storage_class = import_string(settings.DEFAULT_FILE_STORAGE)
    return storage_class()


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

    # avatar = models.URLField(null=True, blank=True)
    avatar = models.ImageField(
        upload_to="avatars/",
        storage=get_dynamic_storage,
        null=True
    )
    phone = models.CharField(max_length=15, null=True)

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


class Tag(models.Model):
    class TagCategory(models.TextChoices):
        SKILL = 'SKILL', 'Kỹ năng'
        FIELD = 'FIELD', 'Lĩnh vực'
        JOB_TYPE = 'JOB_TYPE', 'Hình thức làm việc'
        LEVEL = 'LEVEL', 'Cấp bậc'
        LANGUAGE = 'LANGUAGE', 'Ngôn ngữ'
        BENEFIT = 'BENEFIT', 'Phúc lợi'
    name = models.CharField(max_length=50, unique=True)
    category = models.CharField(
        max_length=20,
        choices=TagCategory.choices
    )

    def __str__(self):
        return self.name


class JobPosting(TimeStampedModel):
    is_active = models.BooleanField(default=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='job_postings')
    company_name = models.CharField(max_length=100)
    title = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(
        upload_to="job-postings/",
        storage=get_dynamic_storage,
        null=True
    )
    salary = models.CharField(max_length=50)
    experience = models.CharField(max_length=50)
    address = models.CharField(max_length=500)
    city_code = models.IntegerField()
    district_code = models.IntegerField(null=True, blank=True)
    ward_code = models.IntegerField(null=True, blank=True)
    deadline = models.DateTimeField()

    tags = models.ManyToManyField(Tag, related_name="job_postings", blank=True)


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
