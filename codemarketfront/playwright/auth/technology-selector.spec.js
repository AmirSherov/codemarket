const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.route('**/api/auth/professions/', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 1, name: 'Frontend Developer' }
      ])
    });
  });
  
  await page.route('**/api/auth/technologies/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 1, name: 'React' },
        { id: 2, name: 'JavaScript' },
        { id: 3, name: 'HTML/CSS' },
        { id: 4, name: 'TypeScript' },
        { id: 5, name: 'Next.js' }
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
  await page.locator('.profession-selector').getByText('Frontend Developer').click();
  await page.getByRole('button', { name: 'Продолжить' }).click();
});

test('should display technology selector with options', async ({ page }) => {
  await expect(page.locator('.technology-selector')).toBeVisible();
  await expect(page.locator('.technology-selector').getByText('React')).toBeVisible();
  await expect(page.locator('.technology-selector').getByText('JavaScript')).toBeVisible();
  await expect(page.locator('.technology-selector').getByText('HTML/CSS')).toBeVisible();
  await expect(page.locator('.technology-selector').getByText('TypeScript')).toBeVisible();
  await expect(page.locator('.technology-selector').getByText('Next.js')).toBeVisible();
});

test('should select multiple technologies', async ({ page }) => {
  await page.locator('.technology-selector').getByText('React').click();
  await page.locator('.technology-selector').getByText('JavaScript').click();
  await page.locator('.technology-selector').getByText('TypeScript').click();
  await expect(page.locator('.technology-selector__option--selected').getByText('React')).toBeVisible();
  await expect(page.locator('.technology-selector__option--selected').getByText('JavaScript')).toBeVisible();
  await expect(page.locator('.technology-selector__option--selected').getByText('TypeScript')).toBeVisible();
});

test('should deselect technology on second click', async ({ page }) => {
  await page.locator('.technology-selector').getByText('React').click();
  await expect(page.locator('.technology-selector__option--selected').getByText('React')).toBeVisible();
  await page.locator('.technology-selector__option--selected').getByText('React').click();
  await expect(page.locator('.technology-selector__option--selected').getByText('React')).not.toBeVisible();
});

test('should show error if no technology selected', async ({ page }) => {
  await page.getByRole('button', { name: 'Завершить регистрацию' }).click();
  await expect(page.locator('.technology-selector__error')).toBeVisible();
  await expect(page.getByText('Пожалуйста, выберите хотя бы одну технологию')).toBeVisible();
});

test('should complete registration with selected technologies', async ({ page }) => {
  await page.route('**/api/auth/register/', async (route) => {
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        user: { id: 1, username: 'testuser', email: 'test@example.com' }
      })
    });
  });
  
  await page.locator('.technology-selector').getByText('React').click();
  await page.locator('.technology-selector').getByText('JavaScript').click();
  await page.getByRole('button', { name: 'Завершить регистрацию' }).click();
  await expect(page.locator('.verify-email')).toBeVisible();
});

test('should go back to profession selection', async ({ page }) => {
  await page.getByRole('button', { name: 'Назад' }).click();
  await expect(page.locator('.profession-selector')).toBeVisible();
}); 