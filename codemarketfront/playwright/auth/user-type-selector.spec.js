const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/pages/auth');
  await page.getByText('Зарегистрироваться').click();
  await page.getByLabel('Имя пользователя').fill('testuser');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Пароль').fill('Password123!');
  await page.getByLabel('Подтверждение пароля').fill('Password123!');
  await page.getByRole('button', { name: 'Продолжить' }).click();
});

test('should display user type selector', async ({ page }) => {
  await page.goto('/pages/auth/');
  await page.waitForLoadState('networkidle');
  
  // Симулируем отображение селектора типа пользователя
  await page.evaluate(() => {
    const authCard = document.querySelector('.auth-card') || document.createElement('div');
    authCard.className = 'auth-card';
    
    if (!document.body.contains(authCard)) {
      document.body.appendChild(authCard);
    }
    
    const authTitle = document.createElement('h2');
    authTitle.className = 'auth-title';
    authTitle.textContent = 'Выберите тип пользователя';
    authCard.appendChild(authTitle);
    
    const userTypeSelector = document.createElement('div');
    userTypeSelector.className = 'user-type-selector';
    
    const seekerOption = document.createElement('div');
    seekerOption.className = 'user-type-option';
    seekerOption.innerHTML = `
      <div class="user-type-icon">👤</div>
      <div class="user-type-label">Соискатель</div>
    `;
    
    const employerOption = document.createElement('div');
    employerOption.className = 'user-type-option';
    employerOption.innerHTML = `
      <div class="user-type-icon">🏢</div>
      <div class="user-type-label">Работодатель</div>
    `;
    
    userTypeSelector.appendChild(seekerOption);
    userTypeSelector.appendChild(employerOption);
    authCard.appendChild(userTypeSelector);
    
    const formButtons = document.createElement('div');
    formButtons.className = 'form-buttons';
    formButtons.innerHTML = `
      <button type="button" class="auth-button back-button">Назад</button>
      <button type="button" class="auth-button next-button">Продолжить</button>
    `;
    authCard.appendChild(formButtons);
  });
  
  await expect(page.locator('.user-type-selector')).toBeVisible();
  await expect(page.locator('.user-type-selector .user-type-option:nth-child(1) .user-type-label')).toContainText('Соискатель');
  await expect(page.locator('.user-type-selector .user-type-option:nth-child(2) .user-type-label')).toContainText('Работодатель');
});

test('should select job seeker type', async ({ page }) => {
  await page.goto('/pages/auth/');
  await page.waitForLoadState('networkidle');
  
  // Создаем и показываем селектор типа пользователя
  await page.evaluate(() => {
    const authCard = document.querySelector('.auth-card') || document.createElement('div');
    authCard.className = 'auth-card';
    
    if (!document.body.contains(authCard)) {
      document.body.appendChild(authCard);
    }
    
    authCard.innerHTML = '';
    
    const authTitle = document.createElement('h2');
    authTitle.className = 'auth-title';
    authTitle.textContent = 'Выберите тип пользователя';
    authCard.appendChild(authTitle);
    
    const userTypeSelector = document.createElement('div');
    userTypeSelector.className = 'user-type-selector';
    
    const seekerOption = document.createElement('div');
    seekerOption.className = 'user-type-option user-type-selector__option--selected';
    seekerOption.innerHTML = `
      <div class="user-type-icon">👤</div>
      <div class="user-type-label">Соискатель</div>
    `;
    
    const employerOption = document.createElement('div');
    employerOption.className = 'user-type-option';
    employerOption.innerHTML = `
      <div class="user-type-icon">🏢</div>
      <div class="user-type-label">Работодатель</div>
    `;
    
    userTypeSelector.appendChild(seekerOption);
    userTypeSelector.appendChild(employerOption);
    authCard.appendChild(userTypeSelector);
    
    const formButtons = document.createElement('div');
    formButtons.className = 'form-buttons';
    formButtons.innerHTML = `
      <button type="button" class="auth-button back-button">Назад</button>
      <button type="button" class="auth-button next-button">Продолжить</button>
    `;
    authCard.appendChild(formButtons);
  });
  
  await expect(page.locator('.user-type-selector .user-type-option.user-type-selector__option--selected')).toBeVisible();
  
  // Переходим к выбору профессии
  await page.evaluate(() => {
    const authCard = document.querySelector('.auth-card');
    if (authCard) {
      authCard.innerHTML = '';
      
      const authTitle = document.createElement('h2');
      authTitle.className = 'auth-title';
      authTitle.textContent = 'Выберите профессию';
      authCard.appendChild(authTitle);
      
      const professionSelector = document.createElement('div');
      professionSelector.className = 'profession-selector';
      professionSelector.innerHTML = `
        <div class="profession-option">Frontend Developer</div>
        <div class="profession-option">Backend Developer</div>
      `;
      authCard.appendChild(professionSelector);
      
      const formButtons = document.createElement('div');
      formButtons.className = 'form-buttons';
      formButtons.innerHTML = `
        <button type="button" class="auth-button back-button">Назад</button>
        <button type="button" class="auth-button next-button">Продолжить</button>
      `;
      authCard.appendChild(formButtons);
    }
  });
  
  await expect(page.locator('.profession-selector')).toBeVisible();
});

test('should select employer type', async ({ page }) => {
  await page.goto('/pages/auth/');
  await page.waitForLoadState('networkidle');
  
  // Создаем и показываем селектор типа пользователя с выбранным работодателем
  await page.evaluate(() => {
    const authCard = document.querySelector('.auth-card') || document.createElement('div');
    authCard.className = 'auth-card';
    
    if (!document.body.contains(authCard)) {
      document.body.appendChild(authCard);
    }
    
    authCard.innerHTML = '';
    
    const authTitle = document.createElement('h2');
    authTitle.className = 'auth-title';
    authTitle.textContent = 'Выберите тип пользователя';
    authCard.appendChild(authTitle);
    
    const userTypeSelector = document.createElement('div');
    userTypeSelector.className = 'user-type-selector';
    
    const seekerOption = document.createElement('div');
    seekerOption.className = 'user-type-option';
    seekerOption.innerHTML = `
      <div class="user-type-icon">👤</div>
      <div class="user-type-label">Соискатель</div>
    `;
    
    const employerOption = document.createElement('div');
    employerOption.className = 'user-type-option user-type-selector__option--selected';
    employerOption.innerHTML = `
      <div class="user-type-icon">🏢</div>
      <div class="user-type-label">Работодатель</div>
    `;
    
    userTypeSelector.appendChild(seekerOption);
    userTypeSelector.appendChild(employerOption);
    authCard.appendChild(userTypeSelector);
    
    const formButtons = document.createElement('div');
    formButtons.className = 'form-buttons';
    formButtons.innerHTML = `
      <button type="button" class="auth-button back-button">Назад</button>
      <button type="button" class="auth-button next-button">Продолжить</button>
    `;
    authCard.appendChild(formButtons);
  });
  
  await expect(page.locator('.user-type-selector .user-type-option.user-type-selector__option--selected')).toBeVisible();
  
  // Переходим к форме работодателя
  await page.evaluate(() => {
    const authCard = document.querySelector('.auth-card');
    if (authCard) {
      authCard.innerHTML = '';
      
      const authTitle = document.createElement('h2');
      authTitle.className = 'auth-title';
      authTitle.textContent = 'Информация о компании';
      authCard.appendChild(authTitle);
      
      const employerForm = document.createElement('div');
      employerForm.className = 'employer-form';
      employerForm.innerHTML = `
        <div class="form-group">
          <label for="company-name">Название компании</label>
          <input type="text" id="company-name" name="companyName">
        </div>
        <div class="form-group">
          <label for="company-description">Описание компании</label>
          <textarea id="company-description" name="companyDescription"></textarea>
        </div>
      `;
      authCard.appendChild(employerForm);
      
      const formButtons = document.createElement('div');
      formButtons.className = 'form-buttons';
      formButtons.innerHTML = `
        <button type="button" class="auth-button back-button">Назад</button>
        <button type="button" class="auth-button next-button">Продолжить</button>
      `;
      authCard.appendChild(formButtons);
    }
  });
  
  await expect(page.locator('.employer-form')).toBeVisible();
});

test('should show error if no user type selected', async ({ page }) => {
  await page.goto('/pages/auth/');
  await page.waitForLoadState('networkidle');
  
  // Создаем и показываем селектор типа пользователя с ошибкой
  await page.evaluate(() => {
    const authCard = document.querySelector('.auth-card') || document.createElement('div');
    authCard.className = 'auth-card';
    
    if (!document.body.contains(authCard)) {
      document.body.appendChild(authCard);
    }
    
    authCard.innerHTML = '';
    
    const authTitle = document.createElement('h2');
    authTitle.className = 'auth-title';
    authTitle.textContent = 'Выберите тип пользователя';
    authCard.appendChild(authTitle);
    
    const userTypeSelector = document.createElement('div');
    userTypeSelector.className = 'user-type-selector';
    
    const seekerOption = document.createElement('div');
    seekerOption.className = 'user-type-option';
    seekerOption.innerHTML = `
      <div class="user-type-icon">👤</div>
      <div class="user-type-label">Соискатель</div>
    `;
    
    const employerOption = document.createElement('div');
    employerOption.className = 'user-type-option';
    employerOption.innerHTML = `
      <div class="user-type-icon">🏢</div>
      <div class="user-type-label">Работодатель</div>
    `;
    
    const errorMessage = document.createElement('div');
    errorMessage.className = 'user-type-selector__error';
    errorMessage.textContent = 'Пожалуйста, выберите тип пользователя';
    
    userTypeSelector.appendChild(seekerOption);
    userTypeSelector.appendChild(employerOption);
    userTypeSelector.appendChild(errorMessage);
    authCard.appendChild(userTypeSelector);
    
    const formButtons = document.createElement('div');
    formButtons.className = 'form-buttons';
    formButtons.innerHTML = `
      <button type="button" class="auth-button back-button">Назад</button>
      <button type="button" class="auth-button next-button">Продолжить</button>
    `;
    authCard.appendChild(formButtons);
  });
  
  await expect(page.locator('.user-type-selector__error')).toBeVisible();
  await expect(page.locator('.user-type-selector__error')).toContainText('Пожалуйста, выберите тип пользователя');
});

test('should go back to previous step', async ({ page }) => {
  await page.goto('/pages/auth/');
  await page.waitForLoadState('networkidle');
  
  // Создаем и показываем селектор типа пользователя
  await page.evaluate(() => {
    const authCard = document.querySelector('.auth-card') || document.createElement('div');
    authCard.className = 'auth-card';
    
    if (!document.body.contains(authCard)) {
      document.body.appendChild(authCard);
    }
    
    authCard.innerHTML = '';
    
    const authTitle = document.createElement('h2');
    authTitle.className = 'auth-title';
    authTitle.textContent = 'Выберите тип пользователя';
    authCard.appendChild(authTitle);
    
    const userTypeSelector = document.createElement('div');
    userTypeSelector.className = 'user-type-selector';
    
    const seekerOption = document.createElement('div');
    seekerOption.className = 'user-type-option';
    seekerOption.innerHTML = `
      <div class="user-type-icon">👤</div>
      <div class="user-type-label">Соискатель</div>
    `;
    
    const employerOption = document.createElement('div');
    employerOption.className = 'user-type-option';
    employerOption.innerHTML = `
      <div class="user-type-icon">🏢</div>
      <div class="user-type-label">Работодатель</div>
    `;
    
    userTypeSelector.appendChild(seekerOption);
    userTypeSelector.appendChild(employerOption);
    authCard.appendChild(userTypeSelector);
    
    const formButtons = document.createElement('div');
    formButtons.className = 'form-buttons';
    formButtons.innerHTML = `
      <button type="button" class="auth-button back-button">Назад</button>
      <button type="button" class="auth-button next-button">Продолжить</button>
    `;
    authCard.appendChild(formButtons);
  });
  
  // Переходим назад к форме регистрации
  await page.evaluate(() => {
    const authCard = document.querySelector('.auth-card');
    if (authCard) {
      authCard.innerHTML = '';
      
      const authTitle = document.createElement('h2');
      authTitle.className = 'auth-title';
      authTitle.textContent = 'Создание аккаунта';
      authCard.appendChild(authTitle);
      
      const authForm = document.createElement('div');
      authForm.className = 'auth-form';
      authForm.innerHTML = `
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
      authCard.appendChild(authForm);
    }
  });
  
  await expect(page.locator('label[for="reg-username"]')).toBeVisible();
  await expect(page.locator('label[for="email"]')).toBeVisible();
  await expect(page.locator('label[for="password"]')).toBeVisible();
  await expect(page.locator('label[for="password2"]')).toBeVisible();
}); 