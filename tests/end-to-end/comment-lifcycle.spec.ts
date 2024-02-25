import { prepareRandomNewArticle } from '../../src/factories/article.factory';
import { prepareRandomComment } from '../../src/factories/comment.factory';
import { AddArticleModel } from '../../src/models/article.model';
import { ArticlePage } from '../../src/pages/article.page';
import { ArticlesPage } from '../../src/pages/articles.page';
import { CommentPage } from '../../src/pages/comment.page';
import { LoginPage } from '../../src/pages/login.page';
import { testUser1 } from '../../src/test-data/user.data';
import { AddArticleView } from '../../src/views/add-article.view';
import { AddCommentView } from '../../src/views/add-comment.view';
import { expect, test } from '@playwright/test';

test.describe('Create, verify and delete comment', () => {
  let loginPage: LoginPage;
  let articlesPage: ArticlesPage;
  let articlePage: ArticlePage;
  let commentPage: CommentPage;
  let addArticleView: AddArticleView;
  let articleData: AddArticleModel;
  let addCommentView: AddCommentView;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    articlesPage = new ArticlesPage(page);
    addArticleView = new AddArticleView(page);
    articlePage = new ArticlePage(page);
    addCommentView = new AddCommentView(page);
    commentPage = new CommentPage(page);

    articleData = prepareRandomNewArticle();
    await loginPage.goto();
    await loginPage.login(testUser1);
    await articlesPage.goto();
    await articlesPage.addArticleButtonLogged.click();
    await addArticleView.createArticle(articleData);
  });

  test('Create new comment @GAD-R05-01', async () => {
    // Create new comment
    // Arrange
    const expectedCommentCreatedPopup = 'Comment was created';
    const expectedAddCommentHeader = 'Add New Comment';

    const newCommentData = prepareRandomComment();
    // Act
    await articlePage.addCommentButton.click();
    await expect(addCommentView.addNewHeader).toHaveText(
      expectedAddCommentHeader,
    );

    await addCommentView.bodyInput.fill(newCommentData.body);
    await addCommentView.saveButton.click();

    // Assert
    await expect(articlePage.alertPopUp).toHaveText(
      expectedCommentCreatedPopup,
    );

    // Verify comment
    const articleComment = articlePage.getArticleComment(newCommentData.body);
    await expect(articleComment.body).toHaveText(newCommentData.body);
    await articleComment.link.click();

    // Assert
    await expect(commentPage.commentBody).toHaveText(newCommentData.body);
  });
});