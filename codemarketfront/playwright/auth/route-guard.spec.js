const { test, expect } = require('@playwright/test');

test('should redirect unauthenticated user from protected page to login', async ({ page }) => {
  await page.goto('/pages/dashboard');
  await expect(page).toHaveURL('/pages/auth');
});

test('should allow authenticated user to access protected page', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('access_token', 'fake-access-token');
    localStorage.setItem('refresh_token', 'fake-refresh-token');
    localStorage.setItem('user', JSON.stringify({
      id: 1,
      username: 'testuser',
      email: 'test@example.com'
    }));
  });
  
  await page.route('**/api/auth/me/', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 1,
        username: 'testuser',
        email: 'test@example.com'
      })
    });
  });
  
  await page.goto('/pages/dashboard');
  await expect(page).toHaveURL('/pages/dashboard');
});

test('should redirect authenticated user from auth page to dashboard', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('access_token', 'fake-access-token');
    localStorage.setItem('refresh_token', 'fake-refresh-token');
    localStorage.setItem('user', JSON.stringify({
      id: 1,
      username: 'testuser',
      email: 'test@example.com'
    }));
  });
  
  await page.route('**/api/auth/me/', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 1,
        username: 'testuser',
        email: 'test@example.com'
      })
    });
  });
  
  await page.goto('/pages/auth');
  await expect(page).toHaveURL('/pages/dashboard');
});

test('should handle expired token and refresh successfully', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('access_token', 'expired-token');
    localStorage.setItem('refresh_token', 'valid-refresh-token');
    localStorage.setItem('user', JSON.stringify({
      id: 1,
      username: 'testuser',
      email: 'test@example.com'
    }));
  });
  
  await page.route('**/api/auth/me/', async (route) => {
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({
        detail: 'Token has expired'
      })
    });
  });
  
  await page.route('**/api/auth/token/refresh/', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        access: 'new-access-token',
        refresh: 'new-refresh-token'
      })
    });
  });
  
  await page.goto('/pages/dashboard');
  const accessToken = await page.evaluate(() => localStorage.getItem('access_token'));
  expect(accessToken).toBe('new-access-token');
});

test('should redirect to login when refresh token fails', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('access_token', 'expired-token');
    localStorage.setItem('refresh_token', 'invalid-refresh-token');
    localStorage.setItem('user', JSON.stringify({
      id: 1,
      username: 'testuser',
      email: 'test@example.com'
    }));
  });
  
  await page.route('**/api/auth/me/', async (route) => {
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({
        detail: 'Token has expired'
      })
    });
  });
  
  await page.route('**/api/auth/token/refresh/', async (route) => {
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({
        detail: 'Invalid refresh token'
      })
    });
  });
  
  await page.goto('/pages/dashboard');
  await expect(page).toHaveURL('/pages/auth');
  
  const accessToken = await page.evaluate(() => localStorage.getItem('access_token'));
  expect(accessToken).toBeNull();
}); 