import { randomNewArticle } from '../src/factories/article.factory';
import { AddArticleModel } from '../src/models/article.model';
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
  let articleData: AddArticleModel;
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    articles = new ArticlesPage(page);
    addArticleView = new AddArticleView(page);
    await loginPage.goto();
    await loginPage.login(testUser1);
    await articles.goto();
    await articles.addArticleButtonLogged.click();
    articleData = randomNewArticle();
    await expect.soft(addArticleView.header).toBeVisible();
  });

  test('Create new article @GAD_R04_01', async ({ page }) => {
    // Arrange
    const articlePage = new ArticlePage(page);

    //Act
    await addArticleView.createArticle(articleData);

    //Assert
    await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);
    await expect
      .soft(articlePage.articleBody)
      .toHaveText(articleData.body, { useInnerText: true });
  });

  test('Reject article with empty title - negative scenario @GAD-R04-01', async () => {
    // Arrange
    const expectedErrorText = 'Article was not created';
    articleData.title = '';

    //Act
    await addArticleView.createArticle(articleData);

    //Assert
    await expect(addArticleView.alertPopup).toHaveText(expectedErrorText);
  });

  test('Reject article with empty body - negative scenario @GAD-R04-01', async () => {
    // Arrange
    const expectedErrorText = 'Article was not created';

    articleData.body = '';

    //Act
    await addArticleView.createArticle(articleData);

    //Assert
    await expect(addArticleView.alertPopup).toHaveText(expectedErrorText);
  });
});
