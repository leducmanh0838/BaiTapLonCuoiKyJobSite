from django.contrib import admin
from django.utils.safestring import mark_safe

from .models import User, CV, JobPosting, Application


class JobPostingAdmin(admin.ModelAdmin):
    list_display = (
        "id", "title", "owner", "city_code", "salary",
        "experience", "is_active", "deadline", "num_applications"
    )
    list_filter = ("is_active", "city_code", "deadline")
    search_fields = ("title", "address", "owner__username", "owner__email")
    list_editable = ("is_active", "salary", "experience")
    date_hierarchy = "deadline"
    ordering = ("-created_at",)
    readonly_fields = ['image_preview']

    def num_applications(self, obj):
        return obj.applications.count()
    num_applications.short_description = "Số hồ sơ ứng tuyển"

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "owner":
            kwargs["queryset"] = User.objects.filter(role=User.UserRole.EMPLOYER)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

    def image_preview(self, obj):
        if obj.image:
            return mark_safe(f"<img src='{obj.image.url}' width=120 style='border-radius:50%' />")
        return "Không có ảnh đại diện"

    image_preview.short_description = "Ảnh đại diện"

    def has_add_permission(self, request):
        return False


class JobsiteAdminSite(admin.AdminSite):
    site_header = "Hệ thống Quản Lý"
    site_title = "Job Site Admin"
    index_title = "Bảng điều khiển"

# Khởi tạo site
admin_site = JobsiteAdminSite(name="jobsiteadmin")

# Đăng ký models
admin_site.register(JobPosting, JobPostingAdmin)