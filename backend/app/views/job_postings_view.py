from rest_framework import mixins, viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from app.models import JobPosting, Application
from app.paginations import DefaultPagination
from app.permissions import IsOwner, IsEmployer, IsJobPostingApplicationEmployer
from app.serializers.job_posting_serializer import JobPostingCreateSerializer, JobPostingApplicationSerializer, \
    JobPostingSerializer, JobPosingMessageSerializer, EmployerJobPostingSerializer
from app.utils.email_utils import send_mail_async
from app.utils.whoosh_utils.build_index import update_index_for_job
from app.utils.whoosh_utils.search_utils import search_jobs


class JobPostingViewSet(mixins.ListModelMixin,
                        mixins.RetrieveModelMixin,
                        mixins.UpdateModelMixin,
                        mixins.CreateModelMixin,
                        mixins.DestroyModelMixin,
                        viewsets.GenericViewSet):
    pagination_class = DefaultPagination
    queryset = JobPosting.objects.all()
    serializer_class = JobPostingCreateSerializer

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return JobPostingCreateSerializer
        return JobPostingSerializer

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

        keyword = self.request.query_params.get("keyword")
        city_code = self.request.query_params.get("city_code")
        district_code = self.request.query_params.get("district_code")
        owner_id = self.request.query_params.get("owner_id")
        tags = self.request.query_params.getlist("tags")

        if keyword:
            ids = search_jobs(keyword)
            queryset = queryset.filter(id__in=ids)
        if city_code:
            queryset = queryset.filter(city_code=city_code)
        if district_code:
            queryset = queryset.filter(district_code=district_code)
        if owner_id:
            queryset = queryset.filter(owner_id=owner_id)
        if tags:
            print("tags: ", tags)
            # queryset = queryset.filter(tags__id__in=tags).distinct()
            for tag_id in tags:
                queryset = queryset.filter(tags__id=tag_id)
                
        return queryset.order_by('-id')

    def perform_create(self, serializer):
        # image_link = upload_image(self.request)
        job = serializer.save(owner=self.request.user)
        update_index_for_job(job)

    def perform_update(self, serializer):
        job = serializer.save()
        update_index_for_job(job)

    @action(detail=True, methods=['post'], url_path='messages')
    def send_messages(self, request, pk):
        job_posting = self.get_object()
        serializer = JobPosingMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        message = serializer.validated_data['message']
        statuses = serializer.validated_data.get('statuses')

        applications = job_posting.applications.all()
        if statuses:
            applications = applications.filter(status__in=statuses)

        results = []
        for app in applications:
            applicant = app.cv.owner
            email = applicant.email

            if email:
                send_mail_async(
                    subject=f"Thông báo từ {job_posting.company_name}",
                    message=message,
                    from_email=None,
                    recipient_list=[email]
                )
                # send_mail(
                #     subject=f"Thông báo từ {job_posting.company_name}",
                #     message=message,
                #     from_email=None,  # sẽ lấy DEFAULT_FROM_EMAIL
                #     recipient_list=[email],
                #     fail_silently=True  # nếu không muốn raise exception khi lỗi
                # )

            results.append({
                "applicant_id": applicant.id,
                "applicant_name": applicant.username,
                "email": email,
                "status": app.status,
                # "message_sent": message
            })

        return Response({
            "count": len(results),
            "message": message,
            "sent_to": results
        }, status=status.HTTP_200_OK)


class EmployerJobPostingViewSet(mixins.ListModelMixin,
                        viewsets.GenericViewSet):
    pagination_class = DefaultPagination
    serializer_class = EmployerJobPostingSerializer

    def get_queryset(self):
        return JobPosting.objects.filter(owner=self.request.user).order_by('-id')

class JobPostingApplicationViewSet(mixins.ListModelMixin,
                                   mixins.RetrieveModelMixin,
                                   mixins.UpdateModelMixin,
                                   viewsets.GenericViewSet):
    serializer_class = JobPostingApplicationSerializer
    permission_classes = [IsJobPostingApplicationEmployer]
    pagination_class = DefaultPagination

    def get_queryset(self):
        job_posting_id = self.kwargs['job_posting_pk']
        return Application.objects.filter(job_posting_id=job_posting_id)

    @action(detail=True, methods=["patch"], url_path="mark_read")
    def mark_read(self, request, job_posting_pk, pk=None):
        application = self.get_object()
        if not application.is_read:
            application.is_read = True
            application.save(update_fields=["is_read"])
        return Response(
            {"status": "marked as read", "id": application.id},
            status=status.HTTP_200_OK
        )