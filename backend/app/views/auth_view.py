import json
import traceback
from datetime import timedelta

import requests
from django.core.files.base import ContentFile
from django.utils import timezone
from django.utils.timezone import now
from oauth2_provider.models import Application, AccessToken, RefreshToken
from oauthlib.common import generate_token
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status, viewsets
from google.oauth2 import id_token
from google.auth.transport import requests as google_request
import os

from app.models import User
from app.utils.my_upload_file_util import upload_avatar_to_cloudinary
# from app.configs.values import TokenValue
# from app.models import User, LoginType
# from app.utils.media import upload_avatar_to_cloudinary
from project.settings import DOT_CLIENT_ID, FACEBOOK_APP_ID, FACEBOOK_APP_SECRET


class AuthViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @staticmethod
    def handle_social_register(username, first_name, last_name, avatar, email, role, address, phone):
        if User.objects.filter(username=username).exists():
            return Response({"detail": "Tài khoản này đã tồn tại"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            data = {
                "username": username,
                "first_name": first_name,
                "last_name": last_name,
                # "avatar": avatar,
                "role": role,
            }

            if email is not None:  # chỉ thêm nếu có
                data["email"] = email
            if address is not None:
                data["address"] = address
            if phone is not None:
                data["phone"] = phone
            # if avatar is not None:
            #     data["avatar"] = upload_avatar_to_cloudinary(avatar)
            user = User.objects.create(**data)
            response = requests.get(avatar, stream=True, timeout=10)
            if response.status_code == 200:
                file_name = f"{user.username}_google.jpg"
                user.avatar.save(file_name, ContentFile(response.content), save=True)

        user.last_login = now()
        user.save(update_fields=['last_login'])
        application = Application.objects.get(client_id=DOT_CLIENT_ID)

        ACCESS_TOKEN_EXPIRE_SECONDS = 36000

        expires = timezone.now() + timedelta(seconds=ACCESS_TOKEN_EXPIRE_SECONDS)
        access_token = AccessToken.objects.create(
            user=user,
            application=application,
            expires=expires,
            scope="read write",
            token=generate_token(),
        )

        refresh_token = RefreshToken.objects.create(
            user=user,
            application=application,
            token=generate_token(),
            access_token=access_token
        )

        avatar_url = None
        if user.avatar and hasattr(user.avatar, "url"):
            try:
                avatar_url = user.avatar.url
            except Exception:
                avatar_url = None  # hoặc set 1 ảnh mặc định

        # ✅ Trả về token giống như /o/token/
        return Response({
            "token": {
                "access_token": access_token.token,
                "refresh_token": refresh_token.token,
                "expires_in": ACCESS_TOKEN_EXPIRE_SECONDS,
                "expires": expires,
                "token_type": "Bearer",
                "scope": "read write",
            },
            "current_user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "avatar": avatar_url,
                "role": user.role,
            }
        })

    @staticmethod
    def handle_social_login(username, first_name, last_name, avatar, email):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"detail": "Chưa đăng ký tài khoản"}, status=status.HTTP_400_BAD_REQUEST)

        user.last_login = now()
        user.save(update_fields=['last_login'])
        application = Application.objects.get(client_id=DOT_CLIENT_ID)

        ACCESS_TOKEN_EXPIRE_SECONDS = 36000

        expires = timezone.now() + timedelta(seconds=ACCESS_TOKEN_EXPIRE_SECONDS)
        access_token = AccessToken.objects.create(
            user=user,
            application=application,
            expires=expires,
            scope="read write",
            token=generate_token(),
        )

        refresh_token = RefreshToken.objects.create(
            user=user,
            application=application,
            token=generate_token(),
            access_token=access_token
        )

        avatar_url = None
        if user.avatar and hasattr(user.avatar, "url"):
            try:
                avatar_url = user.avatar.url
            except Exception:
                avatar_url = None  # hoặc set 1 ảnh mặc định

        # ✅ Trả về token giống như /o/token/
        return Response({
            "token": {
                "access_token": access_token.token,
                "refresh_token": refresh_token.token,
                "expires_in": ACCESS_TOKEN_EXPIRE_SECONDS,
                "expires": expires,
                "token_type": "Bearer",
                "scope": "read write",
            },
            "current_user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "avatar": avatar_url,
                "role": user.role,
            }
        })

    @action(detail=False, methods=['post'], url_path='google-login')
    def login_google(self, request, pk=None):
        id_token_str = request.data.get("idToken")

        if not id_token_str:
            return Response({"error": "Missing id_token"}, status=400)

        try:
            print("id_token_str: ", id_token_str)
            # ✅ Xác thực với Google
            idinfo = id_token.verify_oauth2_token(
                id_token_str,
                google_request.Request(),
                os.environ.get("GOOGLE_WEB_CLIENT_ID"),
                clock_skew_in_seconds=10
            )

            print("idinfo: ", idinfo)
            email = idinfo["email"]
            first_name = idinfo.get("given_name", "")
            last_name = idinfo.get("family_name", "")
            picture = idinfo.get("picture", "")

            return self.handle_social_login(username=f'google_{email}', email=email, first_name=first_name,
                                            last_name=last_name, avatar=picture)


        except ValueError as ve:
            print("ValueError:", ve)
            traceback.print_exc()
            return Response({"error": f"Invalid token: {str(ve)}"}, status=status.HTTP_400_BAD_REQUEST)


        except Exception as e:
            print("Exception:", e)
            traceback.print_exc()
            return Response({"error": f"Unexpected error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'], url_path='facebook-login')
    def login_facebook(self, request, pk=None):
        access_token = request.data.get("accessToken")
        print(f'data: {json.dumps(request.data, indent=4)}')

        if not access_token:
            return Response({"error": "Missing access token"}, status=400)

        # ✅ Verify token
        app_token = f"{FACEBOOK_APP_ID}|{FACEBOOK_APP_SECRET}"
        debug_url = f"https://graph.facebook.com/debug_token?input_token={access_token}&access_token={app_token}"
        debug_res = requests.get(debug_url).json()

        if "data" not in debug_res or not debug_res["data"].get("is_valid"):
            return Response({"error": "Invalid Facebook token"}, status=400)

        # ✅ Get user info
        profile_url = f"https://graph.facebook.com/me?fields=id,email,first_name,last_name,picture&access_token={access_token}"
        profile = requests.get(profile_url).json()

        fb_id = profile.get("id")
        email = profile.get("email")
        name = profile.get("name", "")
        first_name = profile.get("first_name", name)
        last_name = profile.get("last_name", "")
        avatar = profile.get("picture", {}).get("data", {}).get("url", "")

        # if not email:
        #     return Response({"error": "No email returned from Facebook"}, status=400)

        return self.handle_social_login(username=f'facebook_{fb_id}', email=email, first_name=first_name,
                                        last_name=last_name, avatar=avatar)

    @action(detail=False, methods=['post'], url_path='google-register')
    def register_google(self, request, pk=None):
        id_token_str = request.data.get("idToken")
        role = request.data.get("role")
        address = request.data.get("address")
        phone = request.data.get("phone")

        if not id_token_str:
            return Response({"error": "Missing id_token"}, status=400)

        if role not in User.UserRole.values:
            return Response({"error": "Role không hợp lệ"}, status=400)

        print("id_token_str: ", id_token_str)
        # ✅ Xác thực với Google
        idinfo = id_token.verify_oauth2_token(
            id_token_str,
            google_request.Request(),
            os.environ.get("GOOGLE_WEB_CLIENT_ID"),
            clock_skew_in_seconds=10
        )

        print("idinfo: ", idinfo)
        email = idinfo["email"]
        first_name = idinfo.get("given_name", "")
        last_name = idinfo.get("family_name", "")
        picture = idinfo.get("picture", "")

        return self.handle_social_register(username=f'google_{email}', email=email, first_name=first_name,
                                           last_name=last_name, avatar=picture, role=role, address=address, phone=phone)

    @action(detail=False, methods=['post'], url_path='facebook-register')
    def register_facebook(self, request, pk=None):
        access_token = request.data.get("accessToken")
        role = request.data.get("role")
        address = request.data.get("address")
        phone = request.data.get("phone")
        print(f'data: {json.dumps(request.data, indent=4)}')

        if not access_token:
            return Response({"error": "Missing access token"}, status=400)

        if role not in User.UserRole.values:
            return Response({"error": "Role không hợp lệ"}, status=400)

        # ✅ Verify token
        app_token = f"{FACEBOOK_APP_ID}|{FACEBOOK_APP_SECRET}"
        debug_url = f"https://graph.facebook.com/debug_token?input_token={access_token}&access_token={app_token}"
        debug_res = requests.get(debug_url).json()

        if "data" not in debug_res or not debug_res["data"].get("is_valid"):
            return Response({"error": "Invalid Facebook token"}, status=400)

        # ✅ Get user info
        profile_url = f"https://graph.facebook.com/me?fields=id,email,first_name,last_name,picture&access_token={access_token}"
        profile = requests.get(profile_url).json()

        fb_id = profile.get("id")
        email = profile.get("email")
        name = profile.get("name", "")
        first_name = profile.get("first_name", name)
        last_name = profile.get("last_name", "")
        avatar = profile.get("picture", {}).get("data", {}).get("url", "")

        # if not email:
        #     return Response({"error": "No email returned from Facebook"}, status=400)

        return self.handle_social_register(username=f'facebook_{fb_id}', email=email, first_name=first_name,
                                           last_name=last_name, avatar=avatar, role=role, address=address, phone=phone)

    @action(detail=False, methods=['post'], url_path='verify-google')
    def verify_google_token(self, request, pk=None):
        id_token_str = request.data.get("idToken")

        if not id_token_str:
            return Response({"error": "Missing id_token"}, status=400)

        print("id_token_str: ", id_token_str)
        # ✅ Xác thực với Google
        idinfo = id_token.verify_oauth2_token(
            id_token_str,
            google_request.Request(),
            os.environ.get("GOOGLE_WEB_CLIENT_ID"),
            clock_skew_in_seconds=10
        )

        email = idinfo["email"]
        first_name = idinfo.get("given_name", "")
        last_name = idinfo.get("family_name", "")
        avatar = idinfo.get("picture", "")

        return Response({
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "avatar": avatar,
        })

    @action(detail=False, methods=['post'], url_path='verify-facebook')
    def verify_facebook_token(self, request, pk=None):
        access_token = request.data.get("accessToken")

        if not access_token:
            return Response({"error": "Missing access token"}, status=400)

        # ✅ Verify token
        app_token = f"{FACEBOOK_APP_ID}|{FACEBOOK_APP_SECRET}"
        debug_url = f"https://graph.facebook.com/debug_token?input_token={access_token}&access_token={app_token}"
        debug_res = requests.get(debug_url).json()

        if "data" not in debug_res or not debug_res["data"].get("is_valid"):
            return Response({"error": "Invalid Facebook token"}, status=400)

        # ✅ Get user info
        profile_url = f"https://graph.facebook.com/me?fields=id,email,first_name,last_name,picture&access_token={access_token}"
        profile = requests.get(profile_url).json()

        email = profile.get("email")
        name = profile.get("name", "")
        first_name = profile.get("first_name", name)
        last_name = profile.get("last_name", "")
        avatar = profile.get("picture", {}).get("data", {}).get("url", "")

        return Response({
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "avatar": avatar,
        })
