import { test, expect } from '@playwright/test';

test.describe('Modo Cocina - Smoke Test', () => {
  const RECETA_URL = 'http://localhost:4321/recetas/valdiviano/'; 

  test.beforeEach(async ({ page }) => {
    await page.goto(RECETA_URL);
  });

  test('Abre el modo, muestra los pasos y avanza correctamente', async ({ page }) => {
    // 1. Abrir Modo Cocina
    const btnCocina = page.locator('.btn-modo-cocina').first();
    await btnCocina.click();

    const overlay = page.locator('.mc-overlay');
    await expect(overlay).toBeVisible();

    // 2. Verificar que los pasos cargaron
    const pasos = page.locator('.mc-paso');
    await expect(pasos).not.toHaveCount(0);
    
    // Verificar que el contador diga "1 / X"
    await expect(page.locator('.mc-contador')).toContainText('1 /');

    // 3. Navegar al siguiente paso
    const btnSiguiente = page.locator('.mc-next');
    await btnSiguiente.click();
    await expect(page.locator('.mc-contador')).toContainText('2 /');
  });

  test('El panel de ajustes muestra el selector de voz', async ({ page }) => {
    await page.locator('.btn-modo-cocina').first().click();
    
    // Abrir el bottom sheet
    await page.locator('.mc-mas-toggle').click();

    const sheet = page.locator('.mc-sheet');
    await expect(sheet).toBeVisible();

    // Verificar que la sección de Voz esté ahí
    await expect(sheet.locator('.mc-voz-select')).toBeVisible();
    await expect(sheet.locator('.mc-rate-input')).toBeVisible();
  });
});