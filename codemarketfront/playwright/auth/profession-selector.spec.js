const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.route('**/api/auth/professions/', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 1, name: 'Frontend Developer' },
        { id: 2, name: 'Backend Developer' },
        { id: 3, name: 'UI/UX Designer' },
        { id: 4, name: 'DevOps Engineer' },
        { id: 5, name: 'QA Engineer' }
      ])
    });
  });
  
  await page.goto('/pages/auth');
  await page.getByText('Зарегистрироваться').click();
  await page.getByLabel('Имя пользователя').fill('testuser');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Пароль').fill('Password123!');
  await page.getByLabel('Подтверждение пароля').fill('Password123!');
  await page.getByRole('button', { name: 'Продолжить' }).click();
  await page.locator('.user-type-selector').getByText('Соискатель').click();
  await page.getByRole('button', { name: 'Продолжить' }).click();
});

test('should display profession selector with options', async ({ page }) => {
  await expect(page.locator('.profession-selector')).toBeVisible();
  await expect(page.locator('.profession-selector').getByText('Frontend Developer')).toBeVisible();
  await expect(page.locator('.profession-selector').getByText('Backend Developer')).toBeVisible();
  await expect(page.locator('.profession-selector').getByText('UI/UX Designer')).toBeVisible();
  await expect(page.locator('.profession-selector').getByText('DevOps Engineer')).toBeVisible();
  await expect(page.locator('.profession-selector').getByText('QA Engineer')).toBeVisible();
});

test('should select a profession', async ({ page }) => {
  await page.locator('.profession-selector').getByText('Frontend Developer').click();
  await expect(page.locator('.profession-selector__option--selected').getByText('Frontend Developer')).toBeVisible();
});

test('should show error if no profession selected', async ({ page }) => {
  await page.getByRole('button', { name: 'Продолжить' }).click();
  await expect(page.locator('.profession-selector__error')).toBeVisible();
  await expect(page.getByText('Пожалуйста, выберите профессию')).toBeVisible();
});

test('should proceed to technology selection after selecting profession', async ({ page }) => {
  await page.route('**/api/auth/technologies/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 1, name: 'React' },
        { id: 2, name: 'JavaScript' },
        { id: 3, name: 'HTML/CSS' }
      ])
    });
  });
  
  await page.locator('.profession-selector').getByText('Frontend Developer').click();
  await page.getByRole('button', { name: 'Продолжить' }).click();
  await expect(page.locator('.technology-selector')).toBeVisible();
});

test('should go back to user type selection', async ({ page }) => {
  await page.getByRole('button', { name: 'Назад' }).click();
  await expect(page.locator('.user-type-selector')).toBeVisible();
}); 