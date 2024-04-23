import { prepareRandomArticle } from '@_src/factories/article.factory';
import { prepareRandomComment } from '@_src/factories/comment.factory';
import { AddArticleModel } from '@_src/models/article.model';
import { AddCommentModel } from '@_src/models/comment.model';
import { ArticlePage } from '@_src/pages/article.page';
import { ArticlesPage } from '@_src/pages/articles.page';
import { expect, test } from '@playwright/test';

test.describe('Create, verify and delete comment', () => {
  let articlePage: ArticlePage;
  let articleData: AddArticleModel;

  test.beforeEach(async ({ page }) => {
    const articlesPage = new ArticlesPage(page);

    articleData = prepareRandomArticle();
    await articlesPage.goto();
    const addArticleView = await articlesPage.clickAddArticleButtonLogged();
    articlePage = await addArticleView.createArticle(articleData);
  });

  test('Operate on comments @GAD-R05-01 @GAD-R05-02 @logged', async () => {
    const newCommentData = prepareRandomComment();

    await test.step('create new comment', async () => {
      // Arrange
      const expectedAddCommentHeader = 'Add New Comment';
      const expectedCommentCreatedPopup = 'Comment was created';

      //Act
      const addCommentView = await articlePage.clickAddCommentButton();
      await expect
        .soft(addCommentView.addNewHeader)
        .toHaveText(expectedAddCommentHeader);

      articlePage = await addCommentView.createComment(newCommentData);

      // Assert
      await expect(articlePage.alertPopup).toHaveText(
        expectedCommentCreatedPopup,
      );
    });

    let commentPage = await test.step('Verify comment', async () => {
      const articleComment = articlePage.getArticleComment(newCommentData.body);
      await expect(articleComment.body).toHaveText(newCommentData.body);
      const commentPage = await articlePage.clickCommentLink(articleComment);
      // Assert
      await expect(commentPage.commentBody).toHaveText(newCommentData.body);

      return commentPage;
    });

    let editCommentData: AddCommentModel;
    await test.step('Update comment', async () => {
      // Arrange
      const expectedCommentUpdatedPopup = 'Comment was updated';
      editCommentData = prepareRandomComment();

      //Act
      const editCommentView = await commentPage.clickEditButton();
      commentPage = await editCommentView.updateComment(editCommentData);

      // Assert
      await expect(commentPage.commentBody).toHaveText(editCommentData.body);
      await expect
        .soft(commentPage.alertPopup)
        .toHaveText(expectedCommentUpdatedPopup);
    });

    await test.step('Verify updated comment in article', async () => {
      // eslint-disable-next-line playwright/no-nested-step
      //Act
      const articlePage = await commentPage.clickReturnLink();
      const updatedArticleComment = articlePage.getArticleComment(
        editCommentData.body,
      );

      // Assert
      await expect(updatedArticleComment.body).toHaveText(editCommentData.body);
    });
  });

  test('User can add more than one comment to article @GAD-R05-03 @logged', async () => {
    await test.step('create first comment', async () => {
      // eslint-disable-next-line playwright/no-nested-step
      // Arrange

      const expectedCommentCreatedPopup = 'Comment was created';
      const newCommentData = prepareRandomComment();

      //Act
      const addCommentView = await articlePage.clickAddCommentButton();

      articlePage = await addCommentView.createComment(newCommentData);

      // Assert
      await expect(articlePage.alertPopup).toHaveText(
        expectedCommentCreatedPopup,
      );
    });

    await test.step('Create and verify second comment', async () => {
      // eslint-disable-next-line playwright/no-nested-step
      const secondCommentBody = await test.step('Create comment', async () => {
        const secondCommentData = prepareRandomComment();
        const addCommentView = await articlePage.clickAddCommentButton();
        articlePage = await addCommentView.createComment(secondCommentData);
        return secondCommentData.body;
      });

      // eslint-disable-next-line playwright/no-nested-step
      await test.step('Verify comment', async () => {
        const articleComment = articlePage.getArticleComment(secondCommentBody);
        await expect(articleComment.body).toHaveText(secondCommentBody);
        const commentPage = await articlePage.clickCommentLink(articleComment);
        await expect(commentPage.commentBody).toHaveText(secondCommentBody);
      });
    });
  });
});
