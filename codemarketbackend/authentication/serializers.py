from rest_framework import serializers
from .models import User, EmailVerificationCode
from django.contrib.auth.password_validation import validate_password

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    nickname = serializers.CharField(required=False)
    
    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name', 'age', 'nickname')
        
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Пароли не совпадают"})
        
        email = attrs.get('email')
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email": "Пользователь с таким email уже существует"})
        
        return attrs
        
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        # Пользователь создается с is_active=True, но email не подтвержден
        # Позже можно изменить is_active на False, если требуется строгая проверка
        user.is_email_verified = False
        user.save()
        return user
        
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'age', 'nickname', 'is_email_verified')
        read_only_fields = ('id', 'is_email_verified')

class EmailVerificationSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=6, min_length=6, required=True)
    email = serializers.EmailField(required=True)
    
    def validate_code(self, value):
        # Проверяем, что код состоит только из цифр
        if not value.isdigit():
            raise serializers.ValidationError("Код должен состоять только из цифр")
        return value

class ResendVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    
    def validate_email(self, value):
        try:
            User.objects.get(email=value)
            return value
        except User.DoesNotExist:
            raise serializers.ValidationError("Пользователь с таким email не найден") 