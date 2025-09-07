from django.contrib import admin
from django.utils.safestring import mark_safe

from .models import User, CV, JobPosting, Application, Tag


class ApplicationInline(admin.TabularInline):
    model = Application
    extra = 0
    fields = ("applicant_name", "cv", "status", "is_cancel", "created_at")
    readonly_fields = ("applicant_name", "cv", "is_cancel", "created_at")
    can_delete = False

    def has_add_permission(self, request, obj=None):
        # Không cho tạo Application từ admin
        return False

    def applicant_name(self, obj):
        if obj.cv and obj.cv.owner:
            return obj.cv.owner.get_full_name() or obj.cv.owner.username
        return "N/A"

    applicant_name.short_description = "Ứng viên"


class JobPostingAdmin(admin.ModelAdmin):
    list_display = (
        "id", "title", "company_name", "owner",
        "city_code", "salary", "experience",
        "is_active", "deadline", "num_applications"
    )
    list_filter = ("is_active", "city_code", "deadline")
    search_fields = ("title", "company_name", "address", "owner__username", "owner__email")
    list_editable = ("is_active", "salary", "experience")
    date_hierarchy = "deadline"
    ordering = ("-created_at",)
    readonly_fields = ['image_preview']
    inlines = [ApplicationInline]

    def num_applications(self, obj):
        return obj.applications.count()
    num_applications.short_description = "Số hồ sơ ứng tuyển"

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "owner":
            kwargs["queryset"] = User.objects.filter(role=User.UserRole.EMPLOYER)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

    def image_preview(self, obj):
        if obj.image:
            return mark_safe(f"<img src='{obj.image.url}' width=120 style='border-radius:8px' />")
        return "Không có ảnh"

    image_preview.short_description = "Ảnh minh họa"


class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "email", "role", "phone", "avatar_preview")
    list_filter = ("role",)
    search_fields = ("username", "email", "phone")
    readonly_fields = ("avatar_preview",)

    def avatar_preview(self, obj):
        if obj.avatar:
            return mark_safe(f"<img src='{obj.avatar.url}' width=60 style='border-radius:50%' />")
        return "Không có avatar"

    avatar_preview.short_description = "Avatar"


class CVAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "owner", "created_at")
    search_fields = ("title", "owner__username", "owner__email")
    readonly_fields = ("created_at", "updated_at")


class ApplicationAdmin(admin.ModelAdmin):
    list_display = ("id", "job_posting", "cv", "status", "is_cancel", "created_at")
    list_filter = ("status", "is_cancel")
    search_fields = ("job_posting__title", "cv__title", "cv__owner__username")


class TagAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "category")
    list_filter = ("category",)
    search_fields = ("name",)


class JobsiteAdminSite(admin.AdminSite):
    site_header = "Hệ thống Quản Lý"
    site_title = "Job Site Admin"
    index_title = "Bảng điều khiển"


# Khởi tạo site
admin_site = JobsiteAdminSite(name="jobsiteadmin")

# Đăng ký models
admin_site.register(User, UserAdmin)
admin_site.register(CV, CVAdmin)
admin_site.register(JobPosting, JobPostingAdmin)
admin_site.register(Application, ApplicationAdmin)
admin_site.register(Tag, TagAdmin)
