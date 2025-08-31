from rest_framework import permissions


class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user

class IsEmployer(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == request.user.UserRole.EMPLOYER

class IsJobPostingApplicationEmployer(permissions.BasePermission):
    """
    Chỉ cho phép employer là chủ sở hữu của JobPosting mới được thao tác
    """
    def has_permission(self, request, view):
        # phải đăng nhập + phải là EMPLOYER
        return request.user.is_authenticated and request.user.role == request.user.UserRole.EMPLOYER

    def has_object_permission(self, request, view, obj):
        # obj ở đây là Application → có liên kết đến job_posting
        return obj.job_posting.owner == request.user

class IsApplicationOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.cv.owner == request.user