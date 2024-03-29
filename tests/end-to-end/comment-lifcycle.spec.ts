import { prepareRandomNewArticle } from '@_src/factories/article.factory';
import { prepareRandomComment } from '@_src/factories/comment.factory';
import { AddArticleModel } from '@_src/models/article.model';
import { AddCommentModel } from '@_src/models/comment.model';
import { ArticlePage } from '@_src/pages/article.page';
import { ArticlesPage } from '@_src/pages/articles.page';
import { CommentPage } from '@_src/pages/comment.page';
import { AddArticleView } from '@_src/views/add-article.view';
import { AddCommentView } from '@_src/views/add-comment.view';
import { EditCommentView } from '@_src/views/edit-comment.view';
import { expect, test } from '@playwright/test';

test.describe('Create, verify and delete comment', () => {
  let articlesPage: ArticlesPage;
  let articlePage: ArticlePage;
  let commentPage: CommentPage;
  let addArticleView: AddArticleView;
  let articleData: AddArticleModel;
  let addCommentView: AddCommentView;
  let editCommentView: EditCommentView;

  test.beforeEach(async ({ page }) => {
    articlesPage = new ArticlesPage(page);
    addArticleView = new AddArticleView(page);
    articlePage = new ArticlePage(page);
    addCommentView = new AddCommentView(page);
    commentPage = new CommentPage(page);
    editCommentView = new EditCommentView(page);

    articleData = prepareRandomNewArticle();
    await articlesPage.goto();
    await articlesPage.addArticleButtonLogged.click();
    await addArticleView.createArticle(articleData);
  });

  test('Operate on comments @GAD-R05-01 @GAD-R05-02 @logged', async () => {
    const newCommentData = prepareRandomComment();

    await test.step('create new comment', async () => {
      // Arrange
      const expectedAddCommentHeader = 'Add New Comment';
      const expectedCommentCreatedPopup = 'Comment was created';

      //Act
      await articlePage.addCommentButton.click();
      await expect
        .soft(addCommentView.addNewHeader)
        .toHaveText(expectedAddCommentHeader);

      await addCommentView.createComment(newCommentData);

      // Assert
      await expect(articlePage.alertPopUp).toHaveText(
        expectedCommentCreatedPopup,
      );
    });

    await test.step('Verify comment', async () => {
      const articleComment = articlePage.getArticleComment(newCommentData.body);
      await expect(articleComment.body).toHaveText(newCommentData.body);
      await articleComment.link.click();

      // Assert
      await expect(commentPage.commentBody).toHaveText(newCommentData.body);
    });

    let editCommentData: AddCommentModel;
    await test.step('Update comment', async () => {
      // Arrange
      const expectedCommentUpdatedPopup = 'Comment was updated';
      editCommentData = prepareRandomComment();

      //Act
      await commentPage.editButton.click();
      await editCommentView.updateComment(editCommentData);

      // Assert
      await expect(commentPage.commentBody).toHaveText(editCommentData.body);
      await expect
        .soft(commentPage.alertPopup)
        .toHaveText(expectedCommentUpdatedPopup);
    });

    await test.step('Verify updated comment in article', async () => {
      //Act
      await commentPage.returnLink.click();
      const updatedArticleComment = articlePage.getArticleComment(
        editCommentData.body,
      );

      // Assert
      await expect(updatedArticleComment.body).toHaveText(editCommentData.body);
    });
  });

  test('User can add more than one comment to article @GAD-R05-03 @logged', async () => {
    await test.step('create first comment', async () => {
      // Arrange

      const expectedCommentCreatedPopup = 'Comment was created';
      const newCommentData = prepareRandomComment();

      //Act
      await articlePage.addCommentButton.click();

      await addCommentView.createComment(newCommentData);

      // Assert
      await expect(articlePage.alertPopUp).toHaveText(
        expectedCommentCreatedPopup,
      );
    });

    await test.step('Create and verify second comment', async () => {
      // eslint-disable-next-line playwright/no-nested-step
      const secondCommentBody = await test.step('Create comment', async () => {
        const secondCommentData = prepareRandomComment();
        await articlePage.addCommentButton.click();
        await addCommentView.createComment(secondCommentData);
        return secondCommentData.body;
      });

      // eslint-disable-next-line playwright/no-nested-step
      await test.step('Verify comment', async () => {
        const articleComment = articlePage.getArticleComment(secondCommentBody);
        await expect(articleComment.body).toHaveText(secondCommentBody);
        await articleComment.link.click();
        await expect(commentPage.commentBody).toHaveText(secondCommentBody);
      });
    });
  });
});
