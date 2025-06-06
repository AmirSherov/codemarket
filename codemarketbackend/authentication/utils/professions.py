import json
import os
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def load_professions_data():
    """Загрузка данных о профессиях и технологиях из JSON файла"""
    file_path = os.path.join(settings.BASE_DIR, 'authentication', 'data', 'professions.json')
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return json.load(file)
    except FileNotFoundError:
        logger.error(f"File not found: {file_path}")
        return {}
    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error: {str(e)}")
        return {}

def get_all_professions():
    """Получение списка всех профессий"""
    data = load_professions_data()
    return [
        {'id': prof_id, 'name': prof_data['name']}
        for prof_id, prof_data in data.get('professions', {}).items()
    ]

def get_technologies_by_profession(profession_id):
    """Получение списка технологий для конкретной профессии"""
    data = load_professions_data()
    profession = data.get('professions', {}).get(str(profession_id))
    if profession:
        return profession.get('technologies', [])
    return []

def validate_profession_ids(profession_ids):
    """Проверка существования профессий по их ID"""
    data = load_professions_data()
    valid_ids = set(data.get('professions', {}).keys())
    return all(str(pid) in valid_ids for pid in profession_ids)

def validate_technology_ids(technology_ids):
    """Проверка существования технологий по их ID"""
    data = load_professions_data()
    valid_ids = set()
    for profession in data.get('professions', {}).values():
        valid_ids.update(str(tech['id']) for tech in profession.get('technologies', []))
    return all(str(tid) in valid_ids for tid in technology_ids)

def get_profession_name(profession_id):
    """Получение названия профессии по ID"""
    logger.debug(f"Getting profession name for ID: {profession_id}")
    data = load_professions_data()
    profession = data.get('professions', {}).get(str(profession_id))
    if profession:
        logger.debug(f"Found profession: {profession['name']}")
        return profession['name']
    logger.warning(f"Profession not found for ID: {profession_id}")
    return None

def get_technology_name(technology_id):
    """Получение названия технологии по ID"""
    logger.debug(f"Getting technology name for ID: {technology_id}")
    data = load_professions_data()
    for profession in data.get('professions', {}).values():
        for tech in profession.get('technologies', []):
            if str(tech['id']) == str(technology_id):
                logger.debug(f"Found technology: {tech['name']}")
                return tech['name']
    logger.warning(f"Technology not found for ID: {technology_id}")
    return None 