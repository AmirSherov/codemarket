const { test, expect } = require('@playwright/test');

test('should display verification form', async ({ page }) => {
  // Мокаем состояние приложения для отображения компонента верификации
  await page.goto('/pages/auth');
  await page.evaluate(() => {
    window.localStorage.setItem('registeredEmail', 'test@example.com');
    window.localStorage.setItem('showVerification', 'true');
  });
  
  // Перезагружаем страницу, чтобы применить изменения
  await page.reload();
  
  // Проверяем, что компонент верификации отображается
  await expect(page.locator('.verify-email')).toBeVisible();
  await expect(page.getByText('Подтверждение Email')).toBeVisible();
  await expect(page.getByText('test@example.com')).toBeVisible();
  
  // Проверяем, что отображаются поля для ввода кода
  await expect(page.locator('.verification-code-input')).toBeVisible();
});

test('should show error for invalid verification code', async ({ page }) => {
  // Мокаем API для неверного кода
  await page.route('**/api/auth/verify-email/', async (route) => {
    await route.fulfill({
      status: 400,
      contentType: 'application/json',
      body: JSON.stringify({
        success: false,
        error: 'Неверный код подтверждения'
      })
    });
  });
  
  // Мокаем состояние приложения
  await page.goto('/pages/auth');
  await page.evaluate(() => {
    window.localStorage.setItem('registeredEmail', 'test@example.com');
    window.localStorage.setItem('showVerification', 'true');
  });
  await page.reload();
  
  // Вводим неверный код
  await page.locator('.verification-code-input input').nth(0).fill('1');
  await page.locator('.verification-code-input input').nth(1).fill('2');
  await page.locator('.verification-code-input input').nth(2).fill('3');
  await page.locator('.verification-code-input input').nth(3).fill('4');
  await page.locator('.verification-code-input input').nth(4).fill('5');
  await page.locator('.verification-code-input input').nth(5).fill('6');
  
  // Нажимаем кнопку подтверждения
  await page.getByRole('button', { name: 'Подтвердить' }).click();
  
  // Проверяем, что появляется сообщение об ошибке
  await expect(page.locator('.verify-email-error')).toBeVisible();
  await expect(page.getByText('Неверный код подтверждения')).toBeVisible();
});

test('should redirect after successful verification', async ({ page }) => {
  // Мокаем API для успешной верификации
  await page.route('**/api/auth/verify-email/', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        access: 'fake-access-token',
        refresh: 'fake-refresh-token',
        user: { id: 1, username: 'testuser', email: 'test@example.com' }
      })
    });
  });
  
  // Мокаем состояние приложения
  await page.goto('/pages/auth');
  await page.evaluate(() => {
    window.localStorage.setItem('registeredEmail', 'test@example.com');
    window.localStorage.setItem('showVerification', 'true');
  });
  await page.reload();
  
  // Вводим верный код
  await page.locator('.verification-code-input input').nth(0).fill('1');
  await page.locator('.verification-code-input input').nth(1).fill('2');
  await page.locator('.verification-code-input input').nth(2).fill('3');
  await page.locator('.verification-code-input input').nth(3).fill('4');
  await page.locator('.verification-code-input input').nth(4).fill('5');
  await page.locator('.verification-code-input input').nth(5).fill('6');
  
  // Нажимаем кнопку подтверждения
  await page.getByRole('button', { name: 'Подтвердить' }).click();
  
  // Проверяем, что происходит перенаправление на дашборд
  await expect(page).toHaveURL('/pages/dashboard');
});

test('should go back to login page', async ({ page }) => {
  // Мокаем состояние приложения
  await page.goto('/pages/auth');
  await page.evaluate(() => {
    window.localStorage.setItem('registeredEmail', 'test@example.com');
    window.localStorage.setItem('showVerification', 'true');
  });
  await page.reload();
  
  // Нажимаем на кнопку "Назад"
  await page.getByRole('button', { name: 'Назад' }).click();
  
  // Проверяем, что отображается форма входа
  await expect(page.getByText('Вход в аккаунт')).toBeVisible();
}); 