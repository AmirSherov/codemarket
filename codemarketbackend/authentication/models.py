from django.db import models
from django.contrib.auth.models import AbstractUser
import random
from django.utils import timezone
from datetime import timedelta
import json

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
    description = models.TextField(blank=True, null=True, verbose_name="Описание",max_length=160)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True, verbose_name="Аватар")
    
    class Meta:
        ordering = ['-date_joined']
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Users'
        
    def __str__(self):
        return self.username
    
    def save(self, *args, **kwargs):
        if self.pk:
            try:
                old_instance = User.objects.get(pk=self.pk)
                if old_instance.avatar and self.avatar != old_instance.avatar:
                    old_instance.avatar.delete(save=False)
            except User.DoesNotExist:
                pass

        if not self.nickname:
            self.nickname = self.username
        if isinstance(self.profession_ids, str):
            self.profession_ids = json.loads(self.profession_ids)
        if isinstance(self.technology_ids, str):
            self.technology_ids = json.loads(self.technology_ids)
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
