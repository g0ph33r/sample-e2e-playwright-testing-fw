import { ArticlesPage } from '@_src/pages/articles.page';
import { CommentsPage } from '@_src/pages/comments.page';
import { HomePage } from '@_src/pages/home.page';
import { expect, test } from '@playwright/test';

test.describe('Verify main menu buttons', () => {
  test('Comments button navigates to comments page @GAD-R01-03', async ({
    page,
  }) => {
    // Arrange
    const commentsPage = new CommentsPage(page);
    const articlesPage = new ArticlesPage(page);
    const expectedCommentsTitle = 'Comments';

    // Act
    await articlesPage.goto();
    await articlesPage.mainMenu.commentsButton.click();
    const title = await commentsPage.getTitle();
    // Assert

    expect(title).toContain(expectedCommentsTitle);
  });

  test('Articles button navigates to comments articles page @GAD-R01-03', async ({
    page,
  }) => {
    // Arrange
    const articlesPage = new ArticlesPage(page);
    const commentsPage = new CommentsPage(page);
    const expectedArticlesTitle = 'Articles';

    // Act
    await commentsPage.goto();
    await commentsPage.mainMenu.articlesButton.click();
    const title = await articlesPage.getTitle();
    // Assert

    expect(title).toContain(expectedArticlesTitle);
  });

  test('home page button navigates to main page @GAD-R01-03', async ({
    page,
  }) => {
    // Arrange
    const homePage = new HomePage(page);
    const articlesPage = new ArticlesPage(page);
    const expectedHomePageTitle = 'GAD';

    // Act
    await articlesPage.goto();
    await articlesPage.mainMenu.commentsButton.click();
    const title = await homePage.getTitle();

    // Assert
    expect(title).toContain(expectedHomePageTitle);
  });
});
