from rest_framework import serializers
from app.models import Application, CV

class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = [
            'id',
            'job_posting',
            'cv',
            'status',
            'is_cancel',
            'created_at'
        ]
        read_only_fields = ['id', 'status', 'is_cancel', 'created_at']

    def validate(self, data):
        request = self.context.get('request')
        if not request or not hasattr(request, 'user'):
            raise serializers.ValidationError("Không thể xác thực người dùng.")

        user = request.user
        cv = data.get('cv')

        if not cv.owner == user:
            raise serializers.ValidationError({"cv": "Bạn không có quyền sử dụng CV này."})

        return data

class ApplicationUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = [
            'id',
            'job_posting',
            'cv',
            'status',
            'is_cancel'
        ]
        read_only_fields = [
            'id',
            'job_posting',
            'cv',
            'status'
        ]