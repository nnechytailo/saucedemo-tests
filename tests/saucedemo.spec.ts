import { test, expect } from '@playwright/test'

test.beforeEach('Preconditions', async ({ page }) => {
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

test.describe('Authentication', () => {
    const ACCEPTED_CREDS = [
        'standard_user',
        'secret_sauce'
    ]
    
    test.only('login with valid credentials', async ({ page }) => {
        await page.goto('https://www.saucedemo.com/v1/')

        const usernameField = page.locator(`//input[@data-test='username']`)
        const passwordField = page.locator(`//input[@data-test='password']`)
        const loginButton = page.locator(`//input[@type='submit']`)
        const inventory = page.locator(`//div[@class='inventory_container']`)

        await usernameField.fill(ACCEPTED_CREDS[0])
        await passwordField.fill(ACCEPTED_CREDS[1])
        await loginButton.click()
        
        await expect(page).toHaveURL('https://www.saucedemo.com/v1/inventory.html')
        await expect(inventory).toBeVisible()
    })

    test.only('login with invalid credentials', async ({ page }) => {
        await page.goto('https://www.saucedemo.com/v1/')

        const usernameField = page.locator(`//input[@data-test='username']`)
        const passwordField = page.locator(`//input[@data-test='password']`)
        const loginButton = page.locator(`//input[@type='submit']`)
        const errorMessage = page.locator(`//h3[@data-test='error']`)

        await usernameField.fill('test')
        await passwordField.fill('test')
        await loginButton.click()

        await expect(errorMessage).toContainText('Epic sadface')
    })

    test.only('clear error message', async ({ page }) => {
        await page.goto('https://www.saucedemo.com/v1/')

        const usernameField = page.locator(`//input[@data-test='username']`)
        const passwordField = page.locator(`//input[@data-test='password']`)
        const loginButton = page.locator(`//input[@type='submit']`)
        const errorMessage = page.locator(`//h3[@data-test='error']`)
        const clearButton = page.locator(`//button[@class='error-button']`)

        await usernameField.fill('test')
        await passwordField.fill('test')
        await loginButton.click()

        await expect(errorMessage).toContainText('Epic sadface')
        await expect(errorMessage).toBeVisible()

        await clearButton.click()
        await expect(errorMessage).not.toBeVisible()
    })
})

test.describe('Shopping Cart', () => {
    test('add item to the cart', async ({ page }) => {
        const testItem = page.locator(`//a[@id='item_4_title_link']/div[@class='inventory_item_name']`)
        const addToCartButton = page.locator(`//div[@class='inventory_item'][1]/div[@class='pricebar']/button`)
        const shoppingCartButton = page.locator(`//div[@id='shopping_cart_container']`)
        const itemsCounter = page.locator(`//div[@id='shopping_cart_container']//span`)

        await addToCartButton.click()
        await expect(itemsCounter).toHaveCount(1)

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

    test('remove item from the cart in catalog', async ({ page }) => {
        const addToCartButton = page.locator(`//div[@class='inventory_item'][1]/div[@class='pricebar']/button`)
        const removeButton = page.locator(`//button[text()="REMOVE"]`)
        const itemsCounter = page.locator(`//div[@id='shopping_cart_container']//span`)

        await addToCartButton.click()
        await expect(itemsCounter).toHaveCount(1)
        await removeButton.click()
        await expect(itemsCounter).toHaveCount(0)
    })    
})

test.describe('Sorting', () => {
    test('sorting by price in ASC', async ({ page}) => {
        const sortDropdown = page.locator(`//select[@class='product_sort_container']`)
        const price = page.locator(`//div[@class='inventory_item_price']`)
        
        await sortDropdown.selectOption({ label: 'Price (low to high)' })
        const prices = (await price.allTextContents()).map(text => parseFloat(text.replace('$', '')))
        
        for (let i = 1; i < prices.length; i++) {
            await expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1])
        }
    })

    test('sorting by price in DESC', async ({ page}) => {
        const sortDropdown = page.locator(`//select[@class='product_sort_container']`)
        const price = page.locator(`//div[@class='inventory_item_price']`)
        
        await sortDropdown.selectOption({ label: 'Price (high to low)' })
        const prices = (await price.allTextContents()).map(text => parseFloat(text.replace('$', '')))
        
        for (let i = 1; i < prices.length; i++) {
            await expect(prices[i]).toBeLessThanOrEqual(prices[i - 1])
        }
    })
})