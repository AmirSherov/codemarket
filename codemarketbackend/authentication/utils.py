from django.core.mail import send_mail
from django.conf import settings
from .models import EmailVerificationCode
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import random

def generate_verification_code(user, email):
    """
    Генерирует 6-значный код подтверждения и сохраняет его в базе данных
    """
    verification_code = EmailVerificationCode(
        user=user,
        email=email
    )
    verification_code.save()
    
    return verification_code

def send_verification_email(user, email, code):
    """
    Отправляет электронное письмо с кодом подтверждения
    """
    subject = 'CodeMarket - Подтверждение электронной почты'
    html_message = f"""
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ text-align: center; margin-bottom: 20px; }}
            .code {{ font-size: 30px; font-weight: bold; text-align: center; 
                    letter-spacing: 5px; margin: 30px 0; color: #4f46e5; }}
            .footer {{ margin-top: 30px; font-size: 12px; color: #777; text-align: center; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Подтвердите вашу электронную почту</h2>
            </div>
            <p>Здравствуйте, <b>{user.first_name if user.first_name else user.username}</b>!</p>
            <p>Благодарим вас за регистрацию в CodeMarket. Для завершения регистрации, пожалуйста, введите следующий код подтверждения:</p>
            <div class="code">{code}</div>
            <p>Код действителен в течение 30 минут.</p>
            <p>Если вы не запрашивали этот код, пожалуйста, проигнорируйте данное письмо.</p>
            <div class="footer">
                &copy; 2027 CodeMarket. Все права защищены.
            </div>
        </div>
    </body>
    </html>
    """
    plain_message = strip_tags(html_message)
    return send_mail(
        subject,
        plain_message,
        settings.DEFAULT_FROM_EMAIL,
        [email],
        html_message=html_message,
        fail_silently=False,
    )

def verify_code(user, code):
    """
    Проверяет, действителен ли код подтверждения
    """
    try:
        verification = EmailVerificationCode.objects.filter(
            user=user,
            code=code,
            is_used=False
        ).latest('created_at')
        
        if verification.is_expired:
            return False, "Код подтверждения истек"
        verification.is_used = True
        verification.save()
        user.is_email_verified = True
        user.save()
        
        return True, "Электронная почта успешно подтверждена"
    except EmailVerificationCode.DoesNotExist:
        return False, "Неверный код подтверждения" 