import tempfile
import cloudinary.uploader

from django.conf import settings
from django.core.files.storage import FileSystemStorage
from mega import Mega
from rest_framework.exceptions import ValidationError


def upload_cv(request):
    """
    Phương thức upload CV của người dùng.
    Dùng form-data, thêm trường upload_file để upload cv!!.
    Xử lý rủi ro: nếu MEGA bị lỗi, upload lên thư mục media

    :param request: Django HttpRequest chứa file (request.FILES['file'])
    :return: JsonResponse chứa đường dẫn file đã upload
    """
    upload_file = request.FILES.get("upload_file")
    if not upload_file:
        raise ValidationError({"file": "upload_file là trường bắt buộc, dùng formdata, thêm trường upload_file để upload cv!!."})

    try:
        # --- Đăng nhập MEGA ---
        mega = Mega()
        m = mega.login(settings.MEGA_EMAIL, settings.MEGA_PASSWORD)

        # --- Nếu file nhỏ (InMemoryUploadedFile) thì ghi tạm ra file ---
        if hasattr(upload_file, "temporary_file_path"):
            temp_path = upload_file.temporary_file_path()
        else:
            tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
            for chunk in upload_file.chunks():
                tmp.write(chunk)
            tmp.flush()
            temp_path = tmp.name

        # --- Upload lên MEGA ---
        uploaded = m.upload(temp_path)
        file_link = m.get_upload_link(uploaded)

    except Exception as e:
        # --- Nếu upload MEGA bị lỗi -> lưu file vào MEDIA_ROOT ---
        fs = FileSystemStorage(location=settings.MEDIA_ROOT)
        filename = fs.save(upload_file.name, upload_file)
        my_file_link = fs.url(filename)

        file_link = request.build_absolute_uri(my_file_link)

    return file_link


def upload_image(request):
    """
    Phương thức upload Ảnh
    Dùng form-data, thêm trường upload_image để upload cv!!.
    Xử lý rủi ro: nếu Cloudinary bị lỗi, upload lên thư mục media

    :param request: Django HttpRequest chứa file (request.FILES['file'])
    :return: JsonResponse chứa đường dẫn file đã upload
    """
    upload_image = request.FILES.get("upload_image")
    if not upload_image:
        raise ValidationError({"file": "upload_image là trường bắt buộc, dùng formdata, thêm trường upload_image để upload ảnh!!."})

    try:
        result = cloudinary.uploader.upload(upload_image)
        file_link = result["secure_url"]
    #     result = cloudinary.uploader.upload(file)
    #         return JsonResponse({"url": result["secure_url"]})

    except Exception as e:
        # --- Nếu upload MEGA bị lỗi -> lưu file vào MEDIA_ROOT ---
        fs = FileSystemStorage(location=settings.MEDIA_ROOT)
        filename = fs.save(upload_image.name, upload_image)
        my_file_link = fs.url(filename)

        file_link = request.build_absolute_uri(my_file_link)

    return file_link