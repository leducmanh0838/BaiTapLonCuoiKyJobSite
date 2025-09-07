from django.core.management.base import BaseCommand
from app.models import Tag


class Command(BaseCommand):
    help = "Seed database with default tags for each category (multi-industry)"

    def handle(self, *args, **options):
        default_tags = {
            Tag.TagCategory.SKILL: [
                "Lập trình", "Phân tích dữ liệu", "SEO", "Sáng tạo", "Giảng dạy",
                "Chăm sóc khách hàng", "Thiết kế", "Quản lý dự án",
                "Giao tiếp", "Làm việc nhóm"
            ],
            Tag.TagCategory.FIELD: [
                "Công nghệ thông tin", "Tài chính", "Ngân hàng", "Y tế", "Giáo dục",
                "Xây dựng", "Bất động sản", "Luật", "Marketing", "Sản xuất"
            ],
            Tag.TagCategory.JOB_TYPE: [
                "Full-time", "Part-time", "Từ xa"
            ],
            Tag.TagCategory.LEVEL: [
                "Thực tập sinh",  # Intern
                "Nhân viên",  # Junior
                "Mid-level",  # Mid-level
                "Senior",  # Senior
                "Trưởng nhóm",  # Lead
                "Quản lý",  # Manager
                "Giám đốc",  # Director
                "Phó tổng giám đốc",  # VP
                "Tổng giám đốc"  # CEO/CTO/CFO...
            ],
            Tag.TagCategory.LANGUAGE: [
                "Tiếng Anh", "Tiếng Nhật", "Tiếng Hàn", "Tiếng Trung"
            ],
            Tag.TagCategory.BENEFIT: [
                "Bảo hiểm", "Thưởng Tết", "Lương tháng 13", "Teambuilding", "Đào tạo",
                "Chăm sóc sức khỏe", "Du lịch", "Giờ làm linh hoạt", "Ăn trưa miễn phí", "Laptop"
            ],
        }

        for category, tags in default_tags.items():
            for tag_name in tags:
                tag, created = Tag.objects.get_or_create(
                    name=tag_name,
                    category=category
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f"Created tag: {tag_name} ({category})"))
                else:
                    self.stdout.write(f"Tag already exists: {tag_name} ({category})")

        self.stdout.write(self.style.SUCCESS("Seeding tags completed!"))
