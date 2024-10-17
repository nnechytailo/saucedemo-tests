import { Page } from '@playwright/test'

export const LoginPage = {
    usernameField(page: Page) {
        return page.locator(`//input[@data-test='username']`)
    },

    passwordField(page: Page) {
        return page.locator(`//input[@data-test='password'`)
    }
}



