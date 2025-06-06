from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    CustomTokenObtainPairView,
    UserDetailView,
    VerifyEmailView,
    ResendVerificationCodeView,
    ProfessionViewSet,
    TechnologyViewSet
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', UserDetailView.as_view(), name='user_detail'),
    path('verify-email/', VerifyEmailView.as_view(), name='verify_email'),
    path('resend-verification/', ResendVerificationCodeView.as_view(), name='resend_verification'),
    path('professions/', ProfessionViewSet.as_view({'get': 'list'}), name='profession-list'),
    path('technologies/', TechnologyViewSet.as_view({'get': 'list'}), name='technology-list'),
] 