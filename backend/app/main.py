import os
import django
import random

from django.core.files import File
from django.utils import timezone
from datetime import timedelta
from django.core.files.base import ContentFile

from app.utils.whoosh_utils.search_utils import search_jobs

# setup Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings")
django.setup()

if __name__ == "__main__":
    search_jobs("Nhân viên")

# # from app.models import User, CV, JobPosting, Application
# #
# #
# # def run():
# #     # Xoá dữ liệu cũ để test lại
# #     Application.objects.all().delete()
# #     JobPosting.objects.all().delete()
# #     CV.objects.all().delete()
# #     User.objects.exclude(is_superuser=True).delete()
# #
# #     # Tạo 3 ứng viên
# #     candidates = []
# #     for i in range(1, 4):
# #         user = User.objects.create_user(
# #             username=f"a{i}",
# #             password="123456",
# #             role=User.UserRole.CANDIDATE,
# #             email=f"a{i}@test.com"
# #         )
# #         candidates.append(user)
# #         print("Tạo ứng viên:", user.username)
# #
# #     # Tạo 3 nhà tuyển dụng
# #     employers = []
# #     for i in range(1, 4):
# #         user = User.objects.create_user(
# #             username=f"e{i}",
# #             password="123456",
# #             role=User.UserRole.EMPLOYER,
# #             email=f"e{i}@test.com"
# #         )
# #         employers.append(user)
# #         print("Tạo nhà tuyển dụng:", user.username)
# #
# #     # Mỗi ứng viên tạo 2 CV
# #     pdf_files = ["1.pdf", "2.pdf", "3.pdf"]  # danh sách file pdf thật có sẵn
# #     for candidate in candidates:
# #         for j in range(2):  # mỗi ứng viên tạo 2 CV
# #             pdf_path = os.path.join(os.path.dirname(__file__), pdf_files[j % len(pdf_files)])
# #             with open(pdf_path, "rb") as f:
# #                 cv = CV.objects.create(
# #                     owner=candidate,
# #                     title=f"CV {candidate.username} - {j + 1}",
# #                     summary="Demo CV content",
# #                     file=File(f, name=f"{candidate.username}_cv{j + 1}.pdf")
# #                 )
# #             print("Tạo CV:", cv.title)
# #
# #     # Tạo 10 jobposting
# #     job_postings = []
# #     for i in range(1, 11):
# #         employer = random.choice(employers)
# #         job = JobPosting.objects.create(
# #             is_active=True,
# #             owner=employer,
# #             title=f"Job {i} - {employer.username}",
# #             description="Mô tả công việc",
# #             image="https://placehold.co/600x400",
# #             salary=f"{random.randint(5,15)} triệu",
# #             experience="1-2 năm",
# #             address="Hà Nội",
# #             city_code=1,
# #             deadline=timezone.now() + timedelta(days=30)
# #         )
# #         job_postings.append(job)
# #         print("Tạo Job:", job.title)
# #
# #     # Tạo 10 application (ngẫu nhiên)
# #     cvs = list(CV.objects.all())
# #     for i in range(10):
# #         job = random.choice(job_postings)
# #         cv = random.choice(cvs)
# #         app = Application.objects.create(
# #             job_posting=job,
# #             cv=cv,
# #             status=random.choice([s[0] for s in Application.ApplicationStatus.choices])
# #         )
# #         print(f"Tạo Application: {cv.owner.username} nộp vào {job.title} - status={app.status}")
# #
# #
# # if __name__ == "__main__":
# #     User.objects.get(id=192).delete()
#
# # import random
# # from app.models import CV
# #
# # def main():
# #     pdf_files = [f"cvs/{i}.pdf" for i in range(1, 8)]
# #
# #     updates = []
# #     for cv in CV.objects.all():
# #         cv.file.name = random.choice(pdf_files)
# #         updates.append(cv)
# #
# #     CV.objects.bulk_update(updates, ["file"])
# #     print(f" Đã cập nhật {len(updates)} CV với file ngẫu nhiên.")
# #
# # # Chạy khi gọi script
# # if __name__ == "__main__":
# #     main()
#
# from app.models import JobPosting, Tag
#
# def main():
#     # Lấy tag từ DB theo name + category
#     def get_tag(category, name):
#         return Tag.objects.get(category=category, name=name)
#
#     tags_to_add = [
#         get_tag(Tag.TagCategory.SKILL, "Giao tiếp"),
#         get_tag(Tag.TagCategory.SKILL, "Làm việc nhóm"),
#         get_tag(Tag.TagCategory.JOB_TYPE, "Full-time"),
#         get_tag(Tag.TagCategory.LEVEL, "Nhân viên"),
#         get_tag(Tag.TagCategory.BENEFIT, "Bảo hiểm"),
#         get_tag(Tag.TagCategory.BENEFIT, "Đào tạo"),
#         get_tag(Tag.TagCategory.BENEFIT, "Thưởng Tết"),
#     ]
#
#     # Lấy tất cả job có id >= 7
#     jobs = JobPosting.objects.filter(id__gte=7)
#
#     for job in jobs:
#         job.tags.set(tags_to_add)  # Ghi đè các tag cũ
#         print(f" Đã gán {len(tags_to_add)} tags cho job '{job.title}' (id={job.id})")
#
# if __name__ == "__main__":
#     # main()
#     JobPosting.objects.filter(id__gt=23).delete()

# from whoosh.fields import Schema, TEXT, ID
# from whoosh import index
# from whoosh.qparser import QueryParser
# import os
# import unicodedata
#
# # Hàm bỏ dấu tiếng Việt
# def remove_accents(input_str):
#     return ''.join(
#         c for c in unicodedata.normalize('NFD', input_str)
#         if unicodedata.category(c) != 'Mn'
#     )
#
# schema = Schema(title=TEXT(stored=True), path=ID(stored=True))
#
# if not os.path.exists("indexdir"):
#     os.mkdir("indexdir")
#
# ix = index.create_in("indexdir", schema)
#
# writer = ix.writer()
# writer.add_document(title=remove_accents("Bún bò Huế"), path="/bun-bo")
# writer.add_document(title=remove_accents("Phở gà Hà Nội"), path="/pho-ga")
# writer.add_document(title=remove_accents("Cơm tấm Sài Gòn"), path="/com-tam")
# writer.commit()
#
# # Tìm kiếm
# with ix.searcher() as searcher:
#     query_str = "bun bo"  # Người dùng gõ không dấu
#     query = QueryParser("title", ix.schema).parse(remove_accents(query_str))
#     results = searcher.search(query)
#     for r in results:
#         print(r["title"], r["path"])

# import os
# from whoosh import index
#
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# INDEX_DIR = os.path.join(BASE_DIR, "..", "indexdir")
# INDEX_DIR = os.path.abspath(INDEX_DIR)  # chuẩn hóa thành đường dẫn tuyệt đối
#
# from whoosh import index
# from whoosh.query import Every
# import os
#
# def read_all_documents():
#     if not os.path.exists(INDEX_DIR):
#         print(" indexdir không tồn tại!")
#         return
#
#     if not index.exists_in(INDEX_DIR):
#         print(" Không tìm thấy Whoosh index trong indexdir!")
#         return
#
#     ix = index.open_dir(INDEX_DIR)
#
#     with ix.searcher() as searcher:
#         # Cách 1: dùng Every() để match tất cả documents
#         results = searcher.search(Every(), limit=None)
#
#         print(f"Tìm thấy {len(results)} documents trong index:")
#         for r in results:
#             print(dict(r))  # hoặc r["title"], r["path"] tùy schema
#
#         # --- Hoặc Cách 2: duyệt trực tiếp documents ---
#         # for doc in searcher.documents():
#         #     print(doc)
#
# if __name__ == "__main__":
#     read_all_documents()
