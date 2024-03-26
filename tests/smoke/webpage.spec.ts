import { ArticlesPage } from '@_src/pages/articles.page';
import { CommentsPage } from '@_src/pages/comments.page';
import { HomePage } from '@_src/pages/home.page';
import { expect, test } from '@playwright/test';

test.describe('Verify service main pages', () => {
  test('Verify home page title @GAD-R01-01', async ({ page }) => {
    //Arrange
    const homePage = new HomePage(page);
    const expectedHomePageTitle = 'GAD';

    //Act
    await homePage.goto();

    //Assert

    const title = await homePage.getTitle();
    expect(title).toContain(expectedHomePageTitle);
  });

  test('Verify articles page title @GAD-R01-02', async ({ page }) => {
    //Arrange
    const articles = new ArticlesPage(page);
    const expectedArticlesTitle = /Articles/;

    //Act
    await articles.goto();

    //Assert
    await expect(page).toHaveTitle(expectedArticlesTitle);
  });

  test('Verify comments page title @GAD-R01-02', async ({ page }) => {
    //Arrange

    const comments = new CommentsPage(page);
    const expectedCommentsTitle = /Comments/;

    //Act
    await comments.goto();

    //Assert
    await expect(page).toHaveTitle(expectedCommentsTitle);
  });

  test('Home page title simple', async ({ page }) => {
    //Act
    await page.goto('/articles.html');

    const newLocal = /Articles/;
    //Assert
    await expect(page).toHaveTitle(newLocal);
  });
});
