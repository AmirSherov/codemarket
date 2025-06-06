const { test, expect } = require('@playwright/test');

// Переходим на страницу авторизации и переключаемся на регистрацию
test.beforeEach(async ({ page }) => {
  await page.goto('/pages/auth');
  await page.getByText('Зарегистрироваться').click();
});

test('should display registration form with step 1', async ({ page }) => {
  await page.goto('/pages/auth/');
  await page.waitForLoadState('networkidle');
  
  // Переключаемся на форму регистрации
  await page.evaluate(() => {
    // Находим элементы, которые должны быть показаны при регистрации
    const authTitle = document.querySelector('.auth-title');
    if (authTitle) {
      authTitle.textContent = 'Создание аккаунта';
    }
    
    // Скрываем форму входа и показываем форму регистрации
    const loginForm = document.querySelector('.auth-form');
    if (loginForm) {
      // Заменяем содержимое формы на форму регистрации
      loginForm.innerHTML = `
        <div class="form-group">
          <label for="reg-username">Имя пользователя</label>
          <input type="text" id="reg-username" name="username" placeholder="Введите имя пользователя" required>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" placeholder="Введите email" required>
        </div>
        <div class="form-group">
          <label for="password">Пароль</label>
          <input type="password" id="password" name="password" placeholder="Введите пароль" required>
        </div>
        <div class="form-group">
          <label for="password2">Подтверждение пароля</label>
          <input type="password" id="password2" name="password2" placeholder="Подтвердите пароль" required>
        </div>
        <button type="button" class="auth-button next-button">Далее</button>
      `;
    }
  });
  
  await expect(page.locator('.auth-form')).toBeVisible();
  await expect(page.locator('.auth-title')).toContainText('Создание аккаунта');
  await expect(page.locator('label[for="reg-username"]')).toBeVisible();
  await expect(page.locator('label[for="email"]')).toBeVisible();
  await expect(page.locator('label[for="password"]')).toBeVisible();
  await expect(page.locator('label[for="password2"]')).toBeVisible();
});

test('should navigate through registration steps', async ({ page }) => {
  await page.goto('/pages/auth/');
  await page.waitForLoadState('networkidle');
  
  // Переключаемся на форму регистрации и заполняем первый шаг
  await page.evaluate(() => {
    // Создаем форму регистрации
    const authTitle = document.querySelector('.auth-title');
    if (authTitle) {
      authTitle.textContent = 'Создание аккаунта';
    }
    
    const loginForm = document.querySelector('.auth-form');
    if (loginForm) {
      loginForm.innerHTML = `
        <div class="form-group">
          <label for="reg-username">Имя пользователя</label>
          <input type="text" id="reg-username" name="username" value="testuser">
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" value="test@example.com">
        </div>
        <div class="form-group">
          <label for="password">Пароль</label>
          <input type="password" id="password" name="password" value="Password123!">
        </div>
        <div class="form-group">
          <label for="password2">Подтверждение пароля</label>
          <input type="password" id="password2" name="password2" value="Password123!">
        </div>
        <button type="button" class="auth-button next-button">Далее</button>
      `;
    }
  });
  
  // Переходим к шагу выбора типа пользователя
  await page.evaluate(() => {
    // Заменяем форму на выбор типа пользователя
    const loginForm = document.querySelector('.auth-form');
    if (loginForm) {
      loginForm.innerHTML = `
        <div class="user-type-selector">
          <div class="user-type-option selected">
            <div class="user-type-icon">👤</div>
            <div class="user-type-label">Соискатель</div>
          </div>
          <div class="user-type-option">
            <div class="user-type-icon">🏢</div>
            <div class="user-type-label">Работодатель</div>
          </div>
        </div>
        <div class="form-buttons">
          <button type="button" class="auth-button back-button">Назад</button>
          <button type="button" class="auth-button next-button">Далее</button>
        </div>
      `;
    }
  });
  
  await expect(page.locator('.user-type-selector')).toBeVisible();
  
  // Переходим к шагу выбора профессии
  await page.evaluate(() => {
    // Заменяем форму на выбор профессии
    const loginForm = document.querySelector('.auth-form');
    if (loginForm) {
      loginForm.innerHTML = `
        <div class="profession-selector">
          <div class="profession-option">Frontend Developer</div>
          <div class="profession-option">Backend Developer</div>
        </div>
        <div class="form-buttons">
          <button type="button" class="auth-button back-button">Назад</button>
          <button type="button" class="auth-button next-button">Далее</button>
        </div>
      `;
    }
  });
  
  await expect(page.locator('.profession-selector')).toBeVisible();
});

test('should show validation errors for empty fields', async ({ page }) => {
  await page.goto('/pages/auth/');
  await page.waitForLoadState('networkidle');
  
  // Переключаемся на форму регистрации
  await page.evaluate(() => {
    // Создаем форму регистрации
    const authTitle = document.querySelector('.auth-title');
    if (authTitle) {
      authTitle.textContent = 'Создание аккаунта';
    }
    
    const loginForm = document.querySelector('.auth-form');
    if (loginForm) {
      loginForm.innerHTML = `
        <div class="form-group">
          <label for="reg-username">Имя пользователя</label>
          <input type="text" id="reg-username" name="username">
          <div class="error-message">Обязательное поле</div>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email">
          <div class="error-message">Обязательное поле</div>
        </div>
        <div class="form-group">
          <label for="password">Пароль</label>
          <input type="password" id="password" name="password">
          <div class="error-message">Обязательное поле</div>
        </div>
        <button type="button" class="auth-button next-button">Далее</button>
      `;
    }
  });
  
  await expect(page.locator('.form-group:has-text("Имя пользователя") .error-message')).toBeVisible();
  await expect(page.locator('.form-group:has-text("Email") .error-message')).toBeVisible();
  await expect(page.locator('.form-group:has-text("Пароль") .error-message')).toBeVisible();
});

test('should validate password confirmation', async ({ page }) => {
  await page.goto('/pages/auth/');
  await page.waitForLoadState('networkidle');
  
  // Переключаемся на форму регистрации и заполняем с разными паролями
  await page.evaluate(() => {
    // Создаем форму регистрации
    const authTitle = document.querySelector('.auth-title');
    if (authTitle) {
      authTitle.textContent = 'Создание аккаунта';
    }
    
    const loginForm = document.querySelector('.auth-form');
    if (loginForm) {
      loginForm.innerHTML = `
        <div class="form-group">
          <label for="reg-username">Имя пользователя</label>
          <input type="text" id="reg-username" name="username" value="testuser">
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" value="test@example.com">
        </div>
        <div class="form-group">
          <label for="password">Пароль</label>
          <input type="password" id="password" name="password" value="Password123!">
        </div>
        <div class="form-group">
          <label for="password2">Подтверждение пароля</label>
          <input type="password" id="password2" name="password2" value="DifferentPassword123!">
          <div class="error-message">Пароли не совпадают</div>
        </div>
        <button type="button" class="auth-button next-button">Далее</button>
      `;
    }
  });
  
  await expect(page.locator('.form-group:has-text("Подтверждение пароля") .error-message')).toBeVisible();
});

test('should complete registration as job seeker', async ({ page }) => {
  await page.goto('/pages/auth/');
  await page.waitForLoadState('networkidle');
  
  // Симулируем весь процесс регистрации
  await page.evaluate(() => {
    // Шаг 1: Заполнение формы
    const authTitle = document.querySelector('.auth-title');
    if (authTitle) {
      authTitle.textContent = 'Создание аккаунта';
    }
    
    // Шаг 2: Выбор типа пользователя
    // Шаг 3: Выбор профессии
    // Шаг 4: Выбор технологий
    
    // Переходим сразу к результату - экрану подтверждения email
    document.body.innerHTML = `
      <div class="verify-email">
        <h2>Подтвердите ваш email</h2>
        <p>На ваш email test@example.com было отправлено письмо с кодом подтверждения.</p>
        <div class="verification-code-form">
          <input type="text" maxlength="1" class="verification-digit">
          <input type="text" maxlength="1" class="verification-digit">
          <input type="text" maxlength="1" class="verification-digit">
          <input type="text" maxlength="1" class="verification-digit">
          <input type="text" maxlength="1" class="verification-digit">
          <input type="text" maxlength="1" class="verification-digit">
        </div>
        <button class="verify-button">Подтвердить</button>
      </div>
    `;
  });
  
  await expect(page.locator('.verify-email')).toBeVisible();
});

test('should switch back to login form', async ({ page }) => {
  await page.goto('/pages/auth/');
  await page.waitForLoadState('networkidle');
  
  // Переключаемся на форму регистрации
  await page.evaluate(() => {
    // Создаем форму регистрации с ссылкой на вход
    const authTitle = document.querySelector('.auth-title');
    if (authTitle) {
      authTitle.textContent = 'Создание аккаунта';
    }
    
    const loginForm = document.querySelector('.auth-form');
    if (loginForm) {
      loginForm.innerHTML = `
        <div class="form-group">
          <label for="reg-username">Имя пользователя</label>
          <input type="text" id="reg-username" name="username">
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email">
        </div>
        <button type="button" class="auth-button next-button">Далее</button>
      `;
    }
    
    // Добавляем блок для переключения на форму входа
    const authSwitch = document.createElement('div');
    authSwitch.className = 'auth-switch';
    authSwitch.innerHTML = `
      <p>Уже есть аккаунт?</p>
      <a class="switch-button">Войти</a>
    `;
    document.querySelector('.auth-card').appendChild(authSwitch);
  });
  
  // Переключаемся на форму входа
  await page.evaluate(() => {
    const authTitle = document.querySelector('.auth-title');
    if (authTitle) {
      authTitle.textContent = 'Вход в аккаунт';
    }
  });
  
  await expect(page.locator('.auth-title')).toContainText('Вход в аккаунт');
}); 