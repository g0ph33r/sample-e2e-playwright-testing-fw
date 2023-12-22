import { ArticlesPage } from '../src/pages/articles.page';
import { CommentsPage } from '../src/pages/comments.page';
import { HomePage } from '../src/pages/home.page';
import { expect, test } from '@playwright/test';

test.describe('Verify service main pages', () => {
  test('Verify home page title', async ({ page }) => {
    //Arrange
    const homePage = new HomePage(page);
    //Act
    await homePage.goto();

    //Assert

    const title = await homePage.title();
    expect(title).toContain('GAD');
  });

  test('Verify articles page title', async ({ page }) => {
    //Act

    const articles = new ArticlesPage(page);
    await articles.goto();

    //Assert
    await expect(page).toHaveTitle(/Articles/);
  });

  test('Verify comments page title', async ({ page }) => {
    //Act

    const comments = new CommentsPage(page);
    await comments.goto();

    //Assert
    await expect(page).toHaveTitle(/Comments/);
  });

  test('Home page title simple', async ({ page }) => {
    //Act
    await page.goto('/articles.html');

    //Assert
    await expect(page).toHaveTitle(/Articles/);
  });
});
