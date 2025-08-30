from rest_framework import mixins, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated

from app.models import JobPosting, Application
from app.paginations import DefaultPagination
from app.permissions import IsOwner, IsEmployer, IsJobPostingApplicationEmployer
from app.serializers.job_posting_serializer import JobPostingSerializer, JobPostingApplicationSerializer
from app.utils.my_upload_file_util import upload_image


class JobPostingViewSet(mixins.ListModelMixin,
                        mixins.RetrieveModelMixin,
                        mixins.UpdateModelMixin,
                        mixins.CreateModelMixin,
                        mixins.DestroyModelMixin,
                        viewsets.GenericViewSet):
    pagination_class = DefaultPagination
    queryset = JobPosting.objects.all()
    serializer_class = JobPostingSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        elif self.action == 'create':
            return [IsEmployer()]
        elif self.action in ['update', 'partial_update', 'destroy']:
            # phải là chủ sở hữu mới được sửa/xóa
            return [IsOwner()]
        else:
            return [IsAuthenticated()]

    def get_queryset(self):
        queryset = super().get_queryset()

        title = self.request.query_params.get("title")
        city_code = self.request.query_params.get("city_code")

        if title:
            queryset = queryset.filter(title__icontains=title)  # tìm gần đúng
        if city_code:
            queryset = queryset.filter(city_code=city_code)  # chính xác

        return queryset

    def perform_create(self, serializer):
        image_link = upload_image(self.request)
        serializer.save(owner=self.request.user, image=image_link)

    def perform_update(self, serializer):
        uploaded_file = self.request.FILES.get("upload_image")
        if uploaded_file:
            image_link = upload_image(self.request)
            serializer.save(image=image_link)

    def perform_partial_update(self, serializer):
        uploaded_file = self.request.FILES.get("upload_image")
        if uploaded_file:
            image_link = upload_image(self.request)
            serializer.save(image=image_link)


class JobPostingApplicationViewSet(mixins.ListModelMixin,
                        mixins.RetrieveModelMixin,
                        mixins.UpdateModelMixin,
                        viewsets.GenericViewSet):
    serializer_class = JobPostingApplicationSerializer
    permission_classes = [IsJobPostingApplicationEmployer]

    def get_queryset(self):
        job_posting_id = self.kwargs['job_posting_pk']
        return Application.objects.filter(job_posting_id=job_posting_id)

