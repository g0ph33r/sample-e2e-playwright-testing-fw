import { prepareRandomArticle } from '@_src/factories/article.factory';
import { prepareRandomComment } from '@_src/factories/comment.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';
import { testUser1 } from '@_src/test-data/user.data';

test.describe('Verify comments CRUD operations @api @GAD-R08-04', () => {
  let articleId: number;
  let headers: { [key: string]: string };
  test.beforeAll('create an article', async ({ request }) => {
    // Login
    const loginUrl = '/api/login';
    const userData = {
      email: testUser1.userEmail,
      password: testUser1.userPassword,
    };
    const responseLogin = await request.post(loginUrl, {
      data: userData,
    });
    const responseLoginJson = await responseLogin.json();
    // Create article
    const articlesUrl = '/api/articles';
    const randomArticleData = prepareRandomArticle();
    const articleData = {
      title: randomArticleData.title,
      body: randomArticleData.body,
      date: '2024-01-30T15:44:31Z',
      image:
        '.\\data\\images\\256\\tester-app_9f26eff6-2390-4460-8829-81a9cbe21751.jpg',
    };
    headers = {
      Authorization: `Bearer ${responseLoginJson.access_token}`,
    };
    const responseArticle = await request.post(articlesUrl, {
      headers,
      data: articleData,
    });
    const article = await responseArticle.json();
    articleId = article.id;
  });
  test('should not create a comment without a logged-in user', async ({
    request,
  }) => {
    // Arrange
    const expectedStatusCode = 401;
    const commentsUrl = '/api/comments';
    const randomCommentData = prepareRandomComment();
    const commentData = {
      article_id: articleId,
      body: randomCommentData.body,
      date: '2024-01-30T15:44:31Z',
    };
    // Arrange
    const response = await request.post(commentsUrl, {
      data: commentData,
    });
    // Assert
    expect(response.status()).toBe(expectedStatusCode);
  });
  test('should create a comment with logged-in user', async ({ request }) => {
    // Arrange
    const expectedStatusCode = 201;
    // Act
    const commentsUrl = '/api/comments';
    const randomCommentData = prepareRandomComment();
    const commentData = {
      article_id: articleId,
      body: randomCommentData.body,
      date: '2024-01-30T15:44:31Z',
    };
    // Arrange
    const response = await request.post(commentsUrl, {
      headers,
      data: commentData,
    });
    // Assert
    const actualResponseStatus = response.status();
    expect(
      actualResponseStatus,
      `expect status code ${expectedStatusCode}, and received ${actualResponseStatus}`,
    ).toBe(expectedStatusCode);
    const comment = await response.json();
    expect.soft(comment.body).toEqual(commentData.body);
  });
});
