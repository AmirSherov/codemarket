from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings

def send_verification_code(email, code):
    html_message = render_to_string(
        'email/verification_code.html',
        {'code': code}
    )
    
    send_mail(
        subject='CodeMarket - Подтверждение email',
        message=f'Ваш код подтверждения: {code}',  # Для клиентов без поддержки HTML
        html_message=html_message,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[email],
        fail_silently=False,
    ) 