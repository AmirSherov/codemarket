from rest_framework import serializers
from .models import User, EmailVerificationCode
from .utils.professions import (
    validate_profession_ids, 
    validate_technology_ids,
    get_profession_name,
    get_technology_name
)
import logging

logger = logging.getLogger(__name__)

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    birth_date = serializers.DateField(required=False)
    profession_ids = serializers.ListField(child=serializers.CharField(), required=False, default=list)
    technology_ids = serializers.ListField(child=serializers.CharField(), required=False, default=list)
    
    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'password', 'first_name', 'last_name',
            'birth_date', 'user_type', 'company_name', 'company_position',
            'profession_ids', 'technology_ids'
        )
        
    def validate_profession_ids(self, value):
        if not validate_profession_ids(value):
            raise serializers.ValidationError("Один или несколько ID профессий недействительны")
        return value
        
    def validate_technology_ids(self, value):
        if not validate_technology_ids(value):
            raise serializers.ValidationError("Один или несколько ID технологий недействительны")
        return value
        
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            birth_date=validated_data.get('birth_date'),
            user_type=validated_data.get('user_type'),
            company_name=validated_data.get('company_name'),
            company_position=validated_data.get('company_position'),
            profession_ids=validated_data.get('profession_ids', []),
            technology_ids=validated_data.get('technology_ids', [])
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    profession_ids = serializers.ListField(required=False, default=list)
    technology_ids = serializers.ListField(required=False, default=list)
    professions = serializers.SerializerMethodField()
    technologies = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name',
            'user_type', 'company_name', 'company_position',
            'profession_ids', 'technology_ids', 'professions', 'technologies',
            'birth_date'
        )
    
    def get_professions(self, obj):
        logger.debug(f"Getting professions for user {obj.username}")
        if not hasattr(obj, 'profession_ids') or not obj.profession_ids:
            logger.warning(f"No profession_ids found for user {obj.username}")
            return []
        logger.debug(f"Found profession_ids: {obj.profession_ids}")
        professions = [
            {'id': prof_id, 'name': get_profession_name(prof_id)}
            for prof_id in obj.profession_ids
        ]
        logger.debug(f"Resolved professions: {professions}")
        return professions
    
    def get_technologies(self, obj):
        logger.debug(f"Getting technologies for user {obj.username}")
        if not hasattr(obj, 'technology_ids') or not obj.technology_ids:
            logger.warning(f"No technology_ids found for user {obj.username}")
            return []
        logger.debug(f"Found technology_ids: {obj.technology_ids}")
        technologies = [
            {'id': tech_id, 'name': get_technology_name(tech_id)}
            for tech_id in obj.technology_ids
        ]
        logger.debug(f"Resolved technologies: {technologies}")
        return technologies

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'first_name', 'last_name', 'user_type',
            'company_name', 'company_position',
            'profession_ids', 'technology_ids'
        )
        
    def validate_profession_ids(self, value):
        if not validate_profession_ids(value):
            raise serializers.ValidationError("Один или несколько ID профессий недействительны")
        return value
        
    def validate_technology_ids(self, value):
        if not validate_technology_ids(value):
            raise serializers.ValidationError("Один или несколько ID технологий недействительны")
        return value

class EmailVerificationSerializer(serializers.Serializer):
    code = serializers.CharField()
    email = serializers.EmailField(required=False)

class ResendVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField() 