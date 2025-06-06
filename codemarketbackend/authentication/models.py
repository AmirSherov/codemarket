from django.db import models
from django.contrib.auth.models import AbstractUser
import random
from django.utils import timezone
from datetime import timedelta

class UserType(models.TextChoices):
    JOB_SEEKER = 'job_seeker', 'Ищу работу'
    EMPLOYER = 'employer', 'Предлагаю работу'

class User(AbstractUser):
    birth_date = models.DateField(null=True, blank=True)
    nickname = models.CharField(max_length=50, unique=True, blank=True, null=True)
    email = models.EmailField(unique=True)
    is_email_verified = models.BooleanField(default=False)
    user_type = models.CharField(max_length=50, blank=True)
    company_name = models.CharField(max_length=255, blank=True)
    company_position = models.CharField(max_length=255, blank=True)
    profession_ids = models.JSONField(default=list, blank=True)
    technology_ids = models.JSONField(default=list, blank=True)
    
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        
    def __str__(self):
        return self.username
    
    def save(self, *args, **kwargs):
        if not self.nickname:
            self.nickname = self.username
        super().save(*args, **kwargs)

class EmailVerificationCode(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='verification_codes')
    code = models.CharField(max_length=6)
    email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    
    class Meta:
        verbose_name = 'Email Verification Code'
        verbose_name_plural = 'Email Verification Codes'
        
    def __str__(self):
        return f"Code for {self.email}"
    
    def save(self, *args, **kwargs):
        if not self.code:
            self.code = ''.join([str(random.randint(0, 9)) for _ in range(6)])
        
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(minutes=30)
            
        super().save(*args, **kwargs)
    
    @property
    def is_expired(self):
        return timezone.now() > self.expires_at
