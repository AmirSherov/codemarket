from django.shortcuts import render
from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .serializers import (
    UserRegistrationSerializer, 
    UserSerializer, 
    EmailVerificationSerializer,
    ResendVerificationSerializer,
    UserProfileUpdateSerializer
)
from .models import User, EmailVerificationCode
from .utils.verification import generate_verification_code, send_verification_email, verify_code
from .utils.professions import get_all_professions, get_technologies_by_profession
import re
from rest_framework.permissions import IsAuthenticated
import logging

# Create your views here.

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        if not self.user.is_email_verified and not self.user.is_superuser:
            from rest_framework import serializers
            raise serializers.ValidationError({
                "email_verified": False,
                "detail": "Электронная почта не подтверждена",
                "email": self.user.email,
                "username": self.user.username,
                "first_name": self.user.first_name,
                "last_name": self.user.last_name
            })
            
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserRegistrationSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        verification = generate_verification_code(user, user.email)
        try:
            send_verification_email(user, user.email, verification.code)
        except Exception as e:
            return Response({
                "error": f"Не удалось отправить код подтверждения: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({
            "message": "Пользователь успешно зарегистрирован. Проверьте вашу электронную почту для подтверждения.",
            "user": UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)

class UserDataView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

class UserDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return UserProfileUpdateSerializer
        return UserSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = serializer.data
        return Response(data)

class VerifyEmailView(APIView):
    permission_classes = (permissions.AllowAny,)
    
    def post(self, request):
        serializer = EmailVerificationSerializer(data=request.data)
        if serializer.is_valid():
            code = serializer.validated_data['code']
            email = serializer.validated_data.get('email')
            
            try:
                user = None
                if email:
                    user = User.objects.get(email=email)
                elif request.user.is_authenticated:
                    user = request.user
                else:
                    return Response({"error": "Требуется email или аутентификация"}, status=status.HTTP_400_BAD_REQUEST)
                
                success, message = verify_code(user, code)
                
                if success:
                    refresh = RefreshToken.for_user(user)
                    
                    return Response({
                        "message": message,
                        "user": UserSerializer(user).data,
                        "access": str(refresh.access_token),
                        "refresh": str(refresh)
                    })
                else:
                    return Response({
                        "error": message
                    }, status=status.HTTP_400_BAD_REQUEST)
            except User.DoesNotExist:
                return Response({"error": "Пользователь с указанным email не найден"}, status=status.HTTP_404_NOT_FOUND)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResendVerificationCodeView(APIView):
    permission_classes = (permissions.AllowAny,)
    
    def post(self, request):
        serializer = ResendVerificationSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            
            try:
                user = User.objects.get(email=email)
                if user.is_email_verified:
                    return Response({
                        "message": "Электронная почта уже подтверждена"
                    }, status=status.HTTP_400_BAD_REQUEST)
                verification = generate_verification_code(user, email)
                send_verification_email(user, email, verification.code)
                
                return Response({
                    "message": "Код подтверждения отправлен на вашу электронную почту"
                }, status=status.HTTP_200_OK)
                
            except User.DoesNotExist:
                return Response({
                    "error": "Пользователь с таким email не найден"
                }, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({
                    "error": f"Не удалось отправить код подтверждения: {str(e)}"
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProfessionViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    def list(self, request):
        professions = get_all_professions()
        return Response(professions)

class TechnologyViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    
    def list(self, request):
        profession_id = request.query_params.get('profession_id')
        if not profession_id:
            return Response({"error": "Требуется указать profession_id"}, 
                          status=status.HTTP_400_BAD_REQUEST)
            
        technologies = get_technologies_by_profession(profession_id)
        return Response(technologies)
