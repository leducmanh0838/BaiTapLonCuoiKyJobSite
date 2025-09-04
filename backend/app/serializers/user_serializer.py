from rest_framework import serializers

from app.models import User


class UserAvatarAndNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "avatar"]


# class UserDetailSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ["id", "first_name", "last_name", "avatar", "email, username", "role"]


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        error_messages={'required': 'Mật khẩu là bắt buộc'}
    )


    role = serializers.ChoiceField(
        choices=User.UserRole.choices,
        required=True,
        error_messages={'required': 'Vai trò là bắt buộc'}
    )

    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "avatar", "email",
                  "username", "role", "phone", "password"]
        extra_kwargs = {
            "first_name": {"required": True, "allow_blank": False},
            "last_name": {"required": True, "allow_blank": False},
            "password": {"write_only": True}
        }

    def validate_role(self, value):
        if value == User.UserRole.CANDIDATE or value == User.UserRole.EMPLOYER:
            return value
        else:
            raise serializers.ValidationError('Bạn chỉ được đăng ký với vai trò ứng viên '
                                              'hoặc nhà tuyển dụng ')
        # if value == User.Role.ADMIN:
        #     raise serializers.ValidationError('Vai trò quản trị viên không được sử dụng')
        # if value == User.Role.STORE_CONFIRMED:
        #     raise serializers.ValidationError('Vai trò chủ cửa hàng from được xác nhận không được sử dụng')
        # return value

    def create(self, validated_data):
        data = validated_data.copy()

        user = User(**data)
        user.set_password(data['password'])
        user.save()

        return user
