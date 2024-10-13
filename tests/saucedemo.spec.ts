import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
    const ACCEPTED_CREDS = [
        'standard_user',
        'secret_sauce'
    ]
    
    await page.goto('https://www.saucedemo.com/v1/')

    const usernameField = page.locator(`//input[@data-test='username']`)
    const passwordField = page.locator(`//input[@data-test='password']`)
    const loginButton = page.locator(`//input[@type='submit']`)

    await usernameField.fill(ACCEPTED_CREDS[0])
    await passwordField.fill(ACCEPTED_CREDS[1])
    await loginButton.click()
})

test.describe('Shopping Cart', () => {
    test('add item to the cart', async ({ page }) => {
        const testItem = page.locator(`//a[@id='item_4_title_link']/div[@class='inventory_item_name']`)
        const addToCartButton = page.locator(`//div[@class='inventory_item'][1]/div[@class='pricebar']/button`)
        const shoppingCartButton = page.locator(`//div[@id='shopping_cart_container']`)

        await addToCartButton.click()
        await shoppingCartButton.click()
        
        await expect(testItem).toBeVisible()
        await expect(testItem).toHaveText(' Sauce Labs Backpack ')
    })

    test('remove item from the cart', async ({ page }) => {
        const testItem = page.locator(`//a[@id='item_4_title_link']/div[@class='inventory_item_name']`)
        const addToCartButton = page.locator(`//div[@class='inventory_item'][1]/div[@class='pricebar']/button`)
        const shoppingCartButton = page.locator(`//div[@id='shopping_cart_container']`)
        const removeButton = page.locator(`//button[text()="REMOVE"]`)

        await addToCartButton.click()
        await shoppingCartButton.click()
        
        await expect(testItem).toBeVisible()
        await expect(testItem).toHaveText(' Sauce Labs Backpack ')

        await removeButton.click()
        await expect(testItem).not.toBeVisible()
    })
})