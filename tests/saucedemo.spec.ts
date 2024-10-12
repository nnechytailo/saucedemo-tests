import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/v1/')
})

test.describe('Shopping Cart', () => {
    test('add item to the cart', async ({ page }) => {
        
    })
})