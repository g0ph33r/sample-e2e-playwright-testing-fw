import { ArticlePage } from '../src/pages/article.page';
import { ArticlesPage } from '../src/pages/articles.page';
import { LoginPage } from '../src/pages/login.page';
import { testUser1 } from '../src/test-data/user.data';
import { AddArticleView } from '../src/views/add-article.view';
import { expect, test } from '@playwright/test';

test.describe('Verify articles', () => {
  test('Create new article @GAD_R04_01', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testUser1);

    const articles = new ArticlesPage(page);
    await articles.goto();

    //Act
    const newArticleTitle = 'Qwerty';
    const newArticleBodyText = 'Lorem ipsum text';
    await articles.addArticleButtonLogged.click();
    const addArticleView = new AddArticleView(page);
    await expect.soft(addArticleView.header).toBeVisible();

    await addArticleView.titleInput.fill(newArticleTitle);
    await addArticleView.bodyInput.fill(newArticleBodyText);
    await addArticleView.saveButton.click();

    //Assert
    const articlePage = new ArticlePage(page);
    await expect.soft(articlePage.articleTitle).toHaveText(newArticleTitle);
    await expect.soft(articlePage.articleBody).toHaveText(newArticleBodyText);
  });
});
