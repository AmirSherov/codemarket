const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  // Переходим на страницу авторизации
  await page.goto('/pages/auth');
  
  // Переключаемся на форму регистрации
  await page.getByText('Зарегистрироваться').click();
  
  // Заполняем первый шаг регистрации
  await page.getByLabel('Имя пользователя').fill('employer');
  await page.getByLabel('Email').fill('employer@example.com');
  await page.getByLabel('Пароль').fill('Password123!');
  await page.getByLabel('Подтверждение пароля').fill('Password123!');
  await page.getByRole('button', { name: 'Продолжить' }).click();
  
  // Выбираем тип пользователя "Работодатель"
  await page.locator('.user-type-selector').getByText('Работодатель').click();
  await page.getByRole('button', { name: 'Продолжить' }).click();
});

test('should display employer form', async ({ page }) => {
  // Проверяем, что форма работодателя отображается
  await expect(page.locator('.employer-form')).toBeVisible();
  
  // Проверяем наличие полей
  await expect(page.getByLabel('Название компании')).toBeVisible();
  await expect(page.getByLabel('Должность')).toBeVisible();
});

test('should show validation errors for empty fields', async ({ page }) => {
  // Не заполняем поля
  
  // Нажимаем кнопку "Завершить регистрацию"
  await page.getByRole('button', { name: 'Завершить регистрацию' }).click();
  
  // Проверяем, что появляются сообщения об ошибках
  await expect(page.locator('.form-group:has-text("Название компании") .error-message')).toBeVisible();
  await expect(page.locator('.form-group:has-text("Должность") .error-message')).toBeVisible();
});

test('should complete registration with employer data', async ({ page }) => {
  // Мокаем API для регистрации
  await page.route('**/api/auth/register/', async (route) => {
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        user: { id: 1, username: 'employer', email: 'employer@example.com' }
      })
    });
  });
  
  // Заполняем поля формы работодателя
  await page.getByLabel('Название компании').fill('Test Company');
  await page.getByLabel('Должность').fill('HR Manager');
  
  // Нажимаем кнопку "Завершить регистрацию"
  await page.getByRole('button', { name: 'Завершить регистрацию' }).click();
  
  // Проверяем, что отображается компонент подтверждения email
  await expect(page.locator('.verify-email')).toBeVisible();
});

test('should handle API error during registration', async ({ page }) => {
  // Мокаем API для ошибки регистрации
  await page.route('**/api/auth/register/', async (route) => {
    await route.fulfill({
      status: 400,
      contentType: 'application/json',
      body: JSON.stringify({
        success: false,
        error: 'Компания с таким названием уже существует'
      })
    });
  });
  
  // Заполняем поля формы работодателя
  await page.getByLabel('Название компании').fill('Existing Company');
  await page.getByLabel('Должность').fill('HR Manager');
  
  // Нажимаем кнопку "Завершить регистрацию"
  await page.getByRole('button', { name: 'Завершить регистрацию' }).click();
  
  // Проверяем, что появляется сообщение об ошибке
  await expect(page.locator('.auth-error')).toBeVisible();
  await expect(page.getByText('Компания с таким названием уже существует')).toBeVisible();
});

test('should go back to user type selection', async ({ page }) => {
  // Нажимаем кнопку "Назад"
  await page.getByRole('button', { name: 'Назад' }).click();
  
  // Проверяем, что мы вернулись к выбору типа пользователя
  await expect(page.locator('.user-type-selector')).toBeVisible();
});

test('should validate company name length', async ({ page }) => {
  // Вводим слишком короткое название компании
  await page.getByLabel('Название компании').fill('AB');
  await page.getByLabel('Должность').fill('HR Manager');
  
  // Нажимаем кнопку "Завершить регистрацию"
  await page.getByRole('button', { name: 'Завершить регистрацию' }).click();
  
  // Проверяем, что появляется сообщение об ошибке
  await expect(page.locator('.form-group:has-text("Название компании") .error-message')).toBeVisible();
  await expect(page.getByText('Название компании должно содержать не менее 3 символов')).toBeVisible();
});

test('should validate position length', async ({ page }) => {
  // Вводим слишком короткую должность
  await page.getByLabel('Название компании').fill('Test Company');
  await page.getByLabel('Должность').fill('HR');
  
  // Нажимаем кнопку "Завершить регистрацию"
  await page.getByRole('button', { name: 'Завершить регистрацию' }).click();
  
  // Проверяем, что появляется сообщение об ошибке
  await expect(page.locator('.form-group:has-text("Должность") .error-message')).toBeVisible();
  await expect(page.getByText('Должность должна содержать не менее 3 символов')).toBeVisible();
}); 