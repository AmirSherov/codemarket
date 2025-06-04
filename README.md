# CodeMarket

CodeMarket - это современная платформа для соединения талантливых разработчиков с перспективными компаниями.

## Структура проекта

- `codemarketfront/` - Frontend часть (Next.js)
- `codemarketbackend/` - Backend часть (Django)

## Технологии

### Frontend
- Next.js
- React
- SCSS
- Next Image

### Backend
- Django
- Django REST Framework
- PostgreSQL
- Django CORS Headers

## Установка и запуск

### Backend

```bash
cd codemarketbackend
python -m venv venv
source venv/bin/activate  # для Linux/Mac
# или
venv\Scripts\activate  # для Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd codemarketfront
npm install
npm run dev
```

## Особенности

- Современный адаптивный дизайн
- REST API
- Система аутентификации
- Поиск вакансий и разработчиков
- Профили компаний и разработчиков
- Система отзывов и рейтингов 