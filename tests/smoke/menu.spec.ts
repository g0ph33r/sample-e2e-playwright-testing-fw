import { ArticlesPage } from '../../src/pages/articles.page';
import { CommentsPage } from '../../src/pages/comments.page';
import { HomePage } from '../../src/pages/home.page';
import { expect, test } from '@playwright/test';

test.describe('Verify main menu buttons', () => {
  test('Comments button navigates to comments page @GAD_R01_03', async ({
    page,
  }) => {
    // Arrange
    const articlesPage = new ArticlesPage(page);

    // Act
    await articlesPage.goto();
    await articlesPage.mainMenu.commentsButton.click();
    const commentsPage = new CommentsPage(page);
    const title = await commentsPage.title();
    // Assert

    expect(title).toContain('Comments');
  });

  test('Articles button navigates to comments articles page @GAD_R01_03', async ({
    page,
  }) => {
    // Arrange
    const articlesPage = new ArticlesPage(page);
    const commentsPage = new CommentsPage(page);

    // Act
    await commentsPage.goto();
    await commentsPage.mainMenu.articlesButton.click();
    const title = await articlesPage.title();
    // Assert

    expect(title).toContain('Articles');
  });

  test('home page button navigates to main page @GAD_R01_03', async ({
    page,
  }) => {
    // Arrange
    const articlesPage = new ArticlesPage(page);

    // Act
    await articlesPage.goto();
    await articlesPage.mainMenu.commentsButton.click();
    const homePage = new HomePage(page);
    const title = await homePage.title();

    // Assert

    expect(title).toContain('GAD');
  });
});
