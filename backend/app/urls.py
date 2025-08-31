from rest_framework_nested import routers
from django.urls import path, include

from app.views.auth_view import AuthViewSet
from app.views.cv_view import CVViewSet
from app.views.job_postings_view import JobPostingViewSet, JobPostingApplicationViewSet
from app.views.applications_view import ApplicationViewSet

# from app.views.cv_view import CVViewSet

router = routers.SimpleRouter()
router.register(r'job-postings', JobPostingViewSet, basename='job-postings')

job_postings_nested_router = routers.NestedSimpleRouter(router, r'job-postings', lookup='job_posting')
job_postings_nested_router.register(r'applications', JobPostingApplicationViewSet, basename='jobposting-applications')
router.register(r'cvs', CVViewSet, basename='cvs')
router.register(r'applications', ApplicationViewSet, basename='applications')
router.register(r'auth', AuthViewSet, basename='auth')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(job_postings_nested_router.urls)),
]