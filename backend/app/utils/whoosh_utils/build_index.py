import os
import shutil

from whoosh.fields import Schema, ID, TEXT
from whoosh.index import exists_in, create_in, open_dir

from app.models import JobPosting

INDEX_DIR = "indexdir"

schema = Schema(
    id=ID(stored=True, unique=True),
    title=TEXT(stored=True),
    company_name=TEXT(stored=True),
    tags=TEXT(stored=True),
)

def rebuild_index():
    print("rebuild_index")
    if os.path.exists(INDEX_DIR):
        shutil.rmtree(INDEX_DIR)
    os.makedirs(INDEX_DIR)

    ix = create_in(INDEX_DIR, schema)
    writer = ix.writer()

    # Thêm toàn bộ dữ liệu vào index
    for job_postings in JobPosting.objects.all():
        tag_names = [tag.name for tag in job_postings.tags.all()]
        tag_text = ", ".join(tag_names)

        writer.add_document(
            id=str(job_postings.id),
            title=job_postings.title,
            company_name=job_postings.company_name,
            tags=tag_text,
        )

    writer.commit()
    ix.optimize()
    print("✅ Rebuilt index thành công.")

def build_index():
    print("build_index")

    if not exists_in(INDEX_DIR):
        rebuild_index()

def update_index_for_job(job):
    print("update_index_for_recipe")
    if not exists_in(INDEX_DIR):
        return

    try:
        ix = open_dir(INDEX_DIR)
        writer = ix.writer()

        tags_text = ", ".join([tag.name for tag in job.tags.all()])
        print("tags_text: ", tags_text)

        writer.update_document(
            id=str(job.id),
            title=job.title,
            company_name=job.company_name,
            tags=tags_text
        )

        writer.commit()
        ix.optimize()
        print(f"Cập nhật index cho job ID {job.id}")
    except Exception as e:
        print(f"Lỗi cập nhật index: {e}")