# Платформа “CodeMarket.uz” 🚀

> Локальная биржа вакансий и задач для IT-специалистов Узбекистана

---

## Описание проекта

**CodeMarket.uz** — это веб-приложение, объединяющее разработчиков и работодателей/заказчиков внутри Узбекистана. Основная идея в том, чтобы дать соискателям возможность:
- искать и откликаться на вакансии в IT-компаниях и стартапах по своему стеку;
- публиковать и брать в работу точечные фриланс-проекты или “задачи”;
- общаться с работодателями через встроенный чат в реальном времени;
- получать персональные рекомендации вакансий/задач на основе своих навыков и предпочтений;
- формировать собственный профиль с портфолио, описанием и рейтингом.

Работодатели, в свою очередь, могут:
- разместить вакансию с детальным описанием, требованиями, зарплатной вилкой и дедлайном;
- публиковать небольшие “задачи” (фриланс-заказы) с указанием бюджета и сроков;
- просматривать релевантных кандидатов по фильтрам и рекомендациям;
- общаться с соискателями напрямую через чат;
- формировать репутацию компании (количество выполненных задач, отзывы, рейтинг).

Приложение изначально ориентировано на рынок Узбекистана (Самарканд, Ташкент, Андижан, Бухара и др.), но в перспективе может расширяться на страны СНГ и соседние регионы.

---

## Основные фичи

1. **Регистрация и авторизация пользователей**  
   - Регистрация через email/пароль с подтверждением почты (Django Allauth).  
   - Авторизация по JWT-токенам (DRF SimpleJWT).  
   - Восстановление пароля (email-ссылки).  
   - Привязка соцсетей (Google, GitHub)

2. **Профиль пользователя**  
   - Заголовок: имя, фамилия (или никнейм), должность (Fullstack, Frontend, Backend, DevOps и т.д.).  
   - Аватарка (загрузка изображения → хранится в AWS S3).  
   - Описание “О себе” (краткая биография, навыки, опыт).  
   - Список **навыков** (теги): React.js, Vue.js, Next.js, Node.js, Python, Django, C++, AWS, Firebase и т.д.  
   - Год рождения или возраст, город проживания (Самарканд, Ташкент и др.).  
   - Ссылки на портфолио: GitHub, GitLab, LinkedIn, личный сайт.  
   - Статистика:  
     - Рейтинг (звёзды от 1 до 5) на основе отзывов после выполнения задач/вакансий;  
     - Количество завершённых фриланс-задач;  
     - Количество откликов/наймов.  

3. **Публикация и поиск вакансий**  
   - **Карточка вакансии** содержит:  
     - Должность (текстовое поле или выбор из списка).  
     - Описание (требования, обязанности, условия, зарплата в UZS).  
     - Тип занятости (Full-time, Part-time, контракт, удалённая работа).  
     - Город/регион (Самарканд, Ташкент, Андижан и др.) либо “удалённо”.  
     - Требуемый опыт (Junior, Middle, Senior + годы опыта).  
     - Теги (стек технологий, soft-skills).  
     - Дата публикации и дедлайн при закрытии вакансии (если нужен).  
   - **Фильтры и поиск**:  
     - По ключевым словам в заголовке или описании.  
     - По стеку (чекбоксы с технологиями).  
     - По опыту (Junior/Middle/Senior).  
     - По зарплатной вилке (минимум/максимум).  
     - По городу/удалённая работа.  
   - **Рекомендации**:  
     - Алгоритм тэг-совпадений: если пользователь указал “Vue.js” и “Python”→ ему показываются вакансии с пересечением не менее 1–2 тегов.  
     - Приоритет вакансий с более высоким рейтингом работодателя и более свежей датой публикации.  

4. **Публикация и поиск фриланс-задач (биржа “решений-назаказ”)**  
   - **Карточка задачи**:  
     - Название задачи (коротко: “Создать парсер цен конкурентов на Node.js”).  
     - Полное описание: что нужно сделать, требования к стеку, формат результата.  
     - Бюджет (фиксированная сумма или диапазон) в UZS.  
     - Срок выполнения (дата/время).  
     - Теги (стек технологий, сложность, срочность).  
   - **Отклик разработчика**:  
     - Указание предложенной цены (если заказчик разрешил торговаться) и сроков.  
     - Встроенный чат для уточнения деталей (см. раздел “Чат”).  
     - После закрытия задачи — заказчик оценивает исполнителя (рейтинг и комментарий).  
   - **Поиск и фильтры**: аналогичные вакансиям (теги, срок, бюджет, стек).  
   - **Монетизация**: комиссия платформы (5–10 %) от суммы задачи + платное поднятие задачи (VIP-статус, повышенная видимость).  

5. **Встроенный чат (WebSocket)**  
   - **Реализация** через Django Channels + Redis (Channel Layer).  
   - Приватные чаты “Соискатель ↔ Работодатель” по каждой вакансии/задаче.  
   - Хранение истории сообщений в PostgreSQL.  
   - Уведомления о новых сообщениях:  
     - Web Push (Browser Notifications).  
     - Email.  
     - Telegram-бот (опционально).  

6. **Система рейтингов и отзывов**  
   - После завершения фриланс-задачи или закрытия вакансии обе стороны оставляют отзыв:  
     - Оценка “звёздами” (1–5).  
     - Короткий комментарий (до 500 символов).  
   - Средний рейтинг отображается в профиле:  
     ```
     ★★★★☆ (4.8/5; 25 отзывов)
     ```  
   - Рейтинг влияет на рекомендации (чем выше рейтинг — тем выше в списке вакансий/задач).  

7. **Уведомления**  
   - **Email-уведомления**:  
     - Подтверждение регистрации.  
     - Сброс/смена пароля.  
     - Новый отклик на вакансию/задачу.  
     - Новое сообщение в чате.  
     - Еженедельная рассылка “лучшие вакансии по вашим навыкам” (опционально).  

8. **Административная панель (Django Admin)**  
   - Модерация контента: вакансии, задачи, отзывы.  
   - Управление пользователями (блокировка, восстановление, изменение ролей).  
   - Просмотр статистики: количество новых регистраций, опубликованных вакансий/задач, средний рейтинг платформы.  
   - Возможность ручного выставления “VIP” статусов задачам и вакансиям.  

9. **Локализация (i18n)**  
   - Интерфейс на **русском** и **узбекском** языках.  
   - Возможность переключения языка.  
   - Контент вакансий/задач остаётся на языке автора.  

10. **HR-портал (опционально)**  
    - Загрузка логотипа компании, описание компании, страницы брендов (employer branding).  
    - Сравнительная статистика откликов.  
    - Экспорт резюме соискателей в PDF/CSV.  

---

## Технологический стек

### Фронтенд

- **Next.js (React)**  
  - SSR/SSG для SEO и быстрой загрузки.  
  - Файловая структура:  
    ```
    frontend/
    ├─ pages/
    │   ├─ _app.js
    │   ├─ _document.js
    │   ├─ index.js
    │   ├─ login.js
    │   ├─ register.js
    │   ├─ profile/[id].js
    │   ├─ vacancies/
    │   │   ├─ index.js
    │   │   └─ [id].js
    │   ├─ tasks/
    │   │   ├─ index.js
    │   │   └─ [id].js
    │   └─ dashboard/
    │       ├─ my-vacancies.js
    │       ├─ my-tasks.js
    │       ├─ chat/[roomId].js
    │       ├─ notifications.js
    │       └─ settings.js
    ├─ components/
    │   ├─ Layout.jsx
    │   ├─ Header.jsx
    │   ├─ Footer.jsx
    │   ├─ VacancyCard.jsx
    │   ├─ TaskCard.jsx
    │   ├─ ProfileCard.jsx
    │   ├─ ChatWindow.jsx
    │   ├─ NotificationBadge.jsx
    │   └─ Pagination.jsx
    ├─ store/
    │   ├─ index.js
    │   ├─ slices/
    │   │   ├─ authSlice.js
    │   │   ├─ vacanciesSlice.js
    │   │   ├─ tasksSlice.js
    │   │   ├─ chatSlice.js
    │   │   └─ notificationsSlice.js
    │   └─ api/
    │       ├─ userApi.js
    │       ├─ vacanciesApi.js
    │       ├─ tasksApi.js
    │       ├─ chatApi.js
    │       └─ notificationsApi.js
    ├─ styles/
    │   ├─ globals.scss
    │   ├─ variables.scss
    │   ├─ mixins.scss
    │   └─ components/
    │       ├─ VacancyCard.module.scss
    │       ├─ TaskCard.module.scss
    │       ├─ ChatWindow.module.scss
    │       └─ NotificationBadge.module.scss
    └─ utils/
        ├─ api.js
        └─ helpers.js
    ```

- **Redux Toolkit** (RTK + RTK Query) для глобального состояния:  
  - `authSlice` → текущий пользователь, JWT-токен, статус аутентификации.  
  - `vacanciesSlice` → список вакансий, фильтры, детали выбранной вакансии.  
  - `tasksSlice` → задачи и фильтры.  
  - `chatSlice` → текущие комнаты, сообщения, WebSocket-соединение.  
  - `notificationsSlice` → уведомления пользователя.

- **SCSS + CSS Modules**:  
  - Общие переменные (цвета, шрифты) в `variables.scss`.  
  - Миксины (flex, transition) в `mixins.scss`.  
  - Локальные стили для компонентов (`*.module.scss`).

- **Axios** для HTTP-запросов к API (с автоматической подстановкой JWT).

- **WebSocket**:  
  - Установка соединения через `new WebSocket(...)` в `chatSlice`.  
  - Обработка сообщений через Redux actions.

### Бэкенд

- **Django 4.x + Django REST Framework**  
  - Структура проекта:
    ```
    backend/
    ├─ manage.py
    ├─ requirements.txt
    ├─ project/
    │   ├─ settings.py
    │   ├─ urls.py
    │   ├─ wsgi.py
    │   └─ asgi.py
    ├─ apps/
    │   ├─ users/
    │   │   ├─ models.py
    │   │   ├─ serializers.py
    │   │   ├─ views.py
    │   │   └─ urls.py
    │   ├─ vacancies/
    │   │   ├─ models.py
    │   │   ├─ serializers.py
    │   │   ├─ views.py
    │   │   └─ urls.py
    │   ├─ tasks/
    │   │   ├─ models.py
    │   │   ├─ serializers.py
    │   │   ├─ views.py
    │   │   └─ urls.py
    │   ├─ chat/
    │   │   ├─ consumers.py
    │   │   ├─ models.py
    │   │   ├─ routing.py
    │   │   └─ urls.py
    │   └─ notifications/
    │       ├─ models.py
    │       ├─ serializers.py
    │       └─ views.py
    └─ docker/
        ├─ Dockerfile
        └─ docker-compose.yml
    ```

1. **Приложение `users`**  
   - **Модель `UserProfile`**:  
     ```python
     class UserProfile(AbstractUser):
         avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
         bio = models.TextField(max_length=1000, blank=True)
         skills = models.ManyToManyField('Skill', blank=True)
         city = models.CharField(max_length=100, blank=True)
         birth_date = models.DateField(null=True, blank=True)
         telegram_id = models.CharField(max_length=100, null=True, blank=True)
         rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
         completed_tasks = models.PositiveIntegerField(default=0)
     ```
   - **Модель `Skill`**:  
     ```python
     class Skill(models.Model):
         name = models.CharField(max_length=50, unique=True)
         slug = models.SlugField(max_length=50, unique=True)
     ```
   - **Сериализаторы** (`serializers.py`):  
     - `UserSerializer` (публичный профиль).  
     - `UserCreateSerializer` (регистрация).  
     - `UserUpdateSerializer` (обновление профиля).  
   - **Представления** (`views.py`):  
     - `RegisterView` (Allauth → отправка письма для подтверждения).  
     - `LoginView` (DRF SimpleJWT → выдаёт access + refresh).  
     - `UserDetailView` (GET/PUT профиль).  
     - `SkillListView` (список технологий).  
   - **Маршруты** (`urls.py`):  
     ```python
     from django.urls import path
     from .views import RegisterView, LoginView, UserDetailView, SkillListView

     urlpatterns = [
         path('auth/register/', RegisterView.as_view(), name='auth-register'),
         path('auth/login/', LoginView.as_view(), name='auth-login'),
         path('user/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
         path('skills/', SkillListView.as_view(), name='skill-list'),
     ]
     ```

2. **Приложение `vacancies`**  
   - **Модель `Vacancy`**:  
     ```python
     class Vacancy(models.Model):
         company = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='vacancies')
         title = models.CharField(max_length=200)
         description = models.TextField()
         city = models.CharField(max_length=100)
         is_remote = models.BooleanField(default=False)
         employment_type = models.CharField(
             max_length=20,
             choices=[('full-time','Full-time'), ('part-time','Part-time'), ('contract','Contract')]
         )
         min_salary = models.PositiveIntegerField()
         max_salary = models.PositiveIntegerField()
         required_experience = models.CharField(max_length=20, choices=[('junior','Junior'),('middle','Middle'),('senior','Senior')])
         skills = models.ManyToManyField(Skill, blank=True)
         created_at = models.DateTimeField(auto_now_add=True)
         updated_at = models.DateTimeField(auto_now=True)
         is_active = models.BooleanField(default=True)
     ```
   - **Сериализаторы**:  
     - `VacancySerializer` (список, детали).  
     - `VacancyCreateSerializer` (создание/обновление).  
   - **Представления** (`views.py`):  
     - `VacancyListView` (GET: список вакансий с фильтрами `?skills=python,django&city=Samarkand&page=2`).  
     - `VacancyDetailView` (GET/PUT/DELETE для владельца).  
     - `VacancyApplyView` (POST: отклик соискателя).  
     - `VacancyRecommendationsView` (GET: рекомендации).  
   - **Маршруты** (`urls.py`):  
     ```python
     from django.urls import path
     from .views import (
         VacancyListView, VacancyDetailView,
         VacancyApplyView, VacancyRecommendationsView
     )

     urlpatterns = [
         path('', VacancyListView.as_view(), name='vacancy-list'),
         path('<int:pk>/', VacancyDetailView.as_view(), name='vacancy-detail'),
         path('<int:pk>/apply/', VacancyApplyView.as_view(), name='vacancy-apply'),
         path('recommendations/', VacancyRecommendationsView.as_view(), name='vacancy-recommendations'),
     ]
     ```

3. **Приложение `tasks`**  
   - **Модель `Task`**:  
     ```python
     class Task(models.Model):
         client = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='posted_tasks')
         title = models.CharField(max_length=200)
         description = models.TextField()
         budget = models.PositiveIntegerField()
         deadline = models.DateTimeField()
         skills = models.ManyToManyField(Skill, blank=True)
         created_at = models.DateTimeField(auto_now_add=True)
         is_closed = models.BooleanField(default=False)
     ```
   - **Модель `TaskApplication`**:  
     ```python
     class TaskApplication(models.Model):
         task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='applications')
         developer = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='task_applications')
         proposed_budget = models.PositiveIntegerField(null=True, blank=True)
         proposed_deadline = models.DateTimeField(null=True, blank=True)
         message = models.TextField(blank=True)
         created_at = models.DateTimeField(auto_now_add=True)
         is_accepted = models.BooleanField(default=False)
     ```
   - **Сериализаторы**:  
     - `TaskSerializer`, `TaskCreateSerializer`, `TaskApplicationSerializer`.  
   - **Представления**:  
     - `TaskListView` (GET: список задач с фильтрами по навыкам, бюджету, дедлайну).  
     - `TaskDetailView` (GET/PUT/DELETE для клиента).  
     - `TaskApplyView` (POST: отклик разработчика).  
     - `TaskRecommendationsView` (GET: рекомендации).  
   - **Маршруты** (`urls.py`):  
     ```python
     from django.urls import path
     from .views import (
         TaskListView, TaskDetailView,
         TaskApplyView, TaskRecommendationsView
     )

     urlpatterns = [
         path('', TaskListView.as_view(), name='task-list'),
         path('<int:pk>/', TaskDetailView.as_view(), name='task-detail'),
         path('<int:pk>/apply/', TaskApplyView.as_view(), name='task-apply'),
         path('recommendations/', TaskRecommendationsView.as_view(), name='task-recommendations'),
     ]
     ```

4. **Приложение `chat`**  
   - **Модель `ChatRoom`**:  
     ```python
     class ChatRoom(models.Model):
         participants = models.ManyToManyField(UserProfile, related_name='chat_rooms')
         vacancy = models.ForeignKey(Vacancy, on_delete=models.CASCADE, null=True, blank=True)
         task = models.ForeignKey(Task, on_delete=models.CASCADE, null=True, blank=True)
         created_at = models.DateTimeField(auto_now_add=True)
     ```
   - **Модель `Message`**:  
     ```python
     class Message(models.Model):
         room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
         sender = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
         text = models.TextField()
         timestamp = models.DateTimeField(auto_now_add=True)
     ```
   - **Consumer (`consumers.py`)**:  
     ```python
     class ChatConsumer(AsyncWebsocketConsumer):
         async def connect(self):
             self.room_name = self.scope['url_route']['kwargs']['room_name']
             self.room_group_name = f'chat_{self.room_name}'
             await self.channel_layer.group_add(self.room_group_name, self.channel_name)
             await self.accept()

         async def receive(self, text_data):
             data = json.loads(text_data)
             message = data['message']
             sender_id = data['sender_id']
             await self.save_message(sender_id, self.room_name, message)
             await self.channel_layer.group_send(
                 self.room_group_name,
                 {
                     'type': 'chat_message',
                     'message': message,
                     'sender_id': sender_id,
                 }
             )

         async def chat_message(self, event):
             await self.send(text_data=json.dumps({
                 'message': event['message'],
                 'sender_id': event['sender_id'],
             }))

         @database_sync_to_async
         def save_message(self, sender_id, room_name, message):
             sender = UserProfile.objects.get(id=sender_id)
             room = ChatRoom.objects.get(pk=room_name)
             Message.objects.create(room=room, sender=sender, text=message)
     ```
   - **Routing (`routing.py`)**:  
     ```python
     from django.urls import re_path
     from .consumers import ChatConsumer

     websocket_urlpatterns = [
         re_path(r'ws/chat/(?P<room_name>\d+)/$', ChatConsumer.as_asgi()),
     ]
     ```
   - **URLs (`urls.py`)**:  
     ```python
     from django.urls import path
     from .views import ChatRoomListView, MessageListView

     urlpatterns = [
         path('rooms/', ChatRoomListView.as_view(), name='chat-room-list'),
         path('rooms/<int:room_id>/messages/', MessageListView.as_view(), name='message-list'),
     ]
     ```

5. **Приложение `notifications`**  
   - **Модель `Notification`**:  
     ```python
     class Notification(models.Model):
         user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='notifications')
         title = models.CharField(max_length=200)
         body = models.TextField()
         is_read = models.BooleanField(default=False)
         created_at = models.DateTimeField(auto_now_add=True)
     ```
   - **Сериализаторы** и **представления** для получения списка уведомлений и пометки как прочитанных.  
   - **Логика генерации уведомлений**:  
     - Новый отклик → нотификация работодателю.  
     - Принятие отклика → нотификация разработчику.  
     - Новое сообщение в чате → нотификация.  
     - Рейтинговые события (оставлен отзыв).

---

## Техническая архитектура

```mermaid
flowchart LR
  subgraph Frontend (Next.js)
    A[Браузер пользователя] -->|HTTP/HTTPS| B[Next.js (SSR/CSR)]
    B -->|Axios/Fetch| C[Backend API (Django REST Framework)]
    B -->|WebSocket (ws://)| D[WebSocket-соединение (Django Channels)]
  end

  subgraph Backend (Django + Channels)
    C -->|ORM queries| E[PostgreSQL (Render)]
    D -->|Channel Layer| F[Redis]
    C -->|Файлы| G[AWS S3]
    C -->|Email| H[SMTP / SendGrid]
  end
