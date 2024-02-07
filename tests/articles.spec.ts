import { randomNewArticle } from '../src/factories/article.factory';
import { ArticlePage } from '../src/pages/article.page';
import { ArticlesPage } from '../src/pages/articles.page';
import { LoginPage } from '../src/pages/login.page';
import { testUser1 } from '../src/test-data/user.data';
import { AddArticleView } from '../src/views/add-article.view';
import { expect, test } from '@playwright/test';

test.describe('Verify articles', () => {
  let loginPage: LoginPage;
  let articles: ArticlesPage;
  let addArticleView: AddArticleView;
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    articles = new ArticlesPage(page);
    addArticleView = new AddArticleView(page);
    await loginPage.goto();
    await loginPage.login(testUser1);
    await articles.goto();
    await articles.addArticleButtonLogged.click();
    await expect.soft(addArticleView.addNewHeader).toBeVisible();
  });

  test('Reject article with empty title - negative scenario @GAD-R04-01', async () => {
    // Arrange
    const expectedErrorText = 'Article was not created';
    const articleData = randomNewArticle();
    articleData.title = '';

    //Act
    await addArticleView.createArticle(articleData);

    //Assert
    await expect(addArticleView.alertPopup).toHaveText(expectedErrorText);
  });

  test('Reject article with empty body - negative scenario @GAD-R04-01', async () => {
    // Arrange
    const expectedErrorText = 'Article was not created';
    const articleData = randomNewArticle();
    articleData.body = '';

    //Act
    await addArticleView.createArticle(articleData);

    //Assert
    await expect(addArticleView.alertPopup).toHaveText(expectedErrorText);
  });

  test.describe('Title length', () => {
    test('Reject creating article with title exceeding 128 signs @GAD-R04-02', async () => {
      // Arrange
      const expectedErrorText = 'Article was not created';
      const articleData = randomNewArticle(129);

      //Act
      await addArticleView.createArticle(articleData);

      //Assert
      await expect(addArticleView.alertPopup).toHaveText(expectedErrorText);
    });

    test('Create article with title with 128 signs @GAD-R04-02', async ({
      page,
    }) => {
      // Arrange
      const articlePage = new ArticlePage(page);
      const articleData = randomNewArticle(128);

      //Act
      await addArticleView.createArticle(articleData);

      //Assert
      await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);
    });
  });
});
