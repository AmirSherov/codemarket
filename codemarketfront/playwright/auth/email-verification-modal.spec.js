const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  // Переходим на страницу авторизации
  await page.goto('/pages/auth');
  
  // Мокаем состояние для отображения модального окна
  await page.evaluate(() => {
    window.localStorage.setItem('showVerificationModal', 'true');
    window.localStorage.setItem('registeredEmail', 'test@example.com');
  });
  
  // Перезагружаем страницу, чтобы применить изменения
  await page.reload();
});

test('should display verification modal', async ({ page }) => {
  // Проверяем, что модальное окно отображается
  await expect(page.locator('.modal-overlay')).toBeVisible();
  await expect(page.locator('.modal-content')).toBeVisible();
  await expect(page.getByText('Подтверждение Email')).toBeVisible();
  await expect(page.getByText('test@example.com')).toBeVisible();
  
  // Проверяем наличие кнопок
  await expect(page.getByRole('button', { name: 'Отмена' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Подтвердить' })).toBeVisible();
});

test('should close modal on cancel', async ({ page }) => {
  // Нажимаем кнопку "Отмена"
  await page.getByRole('button', { name: 'Отмена' }).click();
  
  // Проверяем, что модальное окно закрылось
  await expect(page.locator('.modal-overlay')).not.toBeVisible();
  
  // Проверяем, что мы остались на странице авторизации
  await expect(page.getByText('Вход в аккаунт')).toBeVisible();
});

test('should proceed to verification on confirm', async ({ page }) => {
  // Мокаем API для повторной отправки кода
  await page.route('**/api/auth/resend-verification/', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        message: 'Код подтверждения отправлен повторно'
      })
    });
  });
  
  // Нажимаем кнопку "Подтвердить"
  await page.getByRole('button', { name: 'Подтвердить' }).click();
  
  // Проверяем, что модальное окно закрылось
  await expect(page.locator('.modal-overlay')).not.toBeVisible();
  
  // Проверяем, что отображается компонент верификации email
  await expect(page.locator('.verify-email')).toBeVisible();
  await expect(page.getByText('Подтверждение Email')).toBeVisible();
  await expect(page.getByText('test@example.com')).toBeVisible();
});

test('should show error if resend verification fails', async ({ page }) => {
  // Мокаем API для ошибки при повторной отправке кода
  await page.route('**/api/auth/resend-verification/', async (route) => {
    await route.fulfill({
      status: 400,
      contentType: 'application/json',
      body: JSON.stringify({
        success: false,
        error: 'Произошла ошибка при отправке кода'
      })
    });
  });
  
  // Нажимаем кнопку "Подтвердить"
  await page.getByRole('button', { name: 'Подтвердить' }).click();
  
  // Проверяем, что модальное окно остается видимым
  await expect(page.locator('.modal-overlay')).toBeVisible();
  
  // Проверяем, что появляется сообщение об ошибке
  await expect(page.getByText('Произошла ошибка при отправке кода')).toBeVisible();
}); 