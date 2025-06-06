from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from django.template.loader import render_to_string
from ..models import EmailVerificationCode

def generate_verification_code(user, email):
    """Генерация кода подтверждения для пользователя"""
    verification = EmailVerificationCode.objects.create(
        user=user,
        email=email
    )
    return verification

def send_verification_email(user, email, code):
    """Отправка письма с кодом подтверждения"""
    subject = 'CodeMarket - Подтверждение электронной почты'
    html_message = render_to_string(
        'email/verification_code.html',
        {
            'code': code,
            'user': user
        }
    )

    plain_message = f'Здравствуйте, {user.first_name if user.first_name else user.username}!\n\n' \
                   f'Спасибо за регистрацию на CodeMarket. Ваш код подтверждения: {code}\n\n' \
                   f'Код действителен в течение 30 минут.\n\n' \
                   f'С уважением,\nКоманда CodeMarket'
    
    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        html_message=html_message,
        fail_silently=False
    )

def verify_code(user, code):
    """Проверка кода подтверждения"""
    try:
        verification = EmailVerificationCode.objects.filter(
            user=user,
            code=code,
            is_used=False,
            expires_at__gt=timezone.now()
        ).latest('created_at')
        
        verification.is_used = True
        verification.save()
        
        user.is_email_verified = True
        user.save()
        
        return True, "Email успешно подтвержден"
    except EmailVerificationCode.DoesNotExist:
        return False, "Неверный или просроченный код подтверждения" 