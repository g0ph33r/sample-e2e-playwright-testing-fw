import { prepareRandomArticle } from '@_src/factories/article.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';
import { testUser1 } from '@_src/test-data/user.data';

test.describe('Verify articles CRUD operations @api', () => {
  test('should not create an article without a logged-in user', async ({
    request,
  }) => {
    // Arrange
    const expectedStatusCode = 401;
    const articlesUrl = '/api/articles';
    const randomArticleData = prepareRandomArticle();
    const articleData = {
      title: randomArticleData.title,
      body: randomArticleData.body,
      date: '2024-06-30T15:44:31Z',
      image: '',
    };
    // Act
    const response = await request.post(articlesUrl, {
      data: articleData,
    });
    // Assert
    expect(response.status()).toBe(expectedStatusCode);
  });

  test('should create an article with logged-in user', async ({ request }) => {
    // Arrange
    const expectedStatusCode = 401;
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
    // Act
    const articlesUrl = '/api/articles';
    const randomArticleData = prepareRandomArticle();
    const articleData = {
      title: randomArticleData.title,
      body: randomArticleData.body,
      date: '2024-01-30T15:44:31Z',
      image:
        '.\\data\\images\\256\\tester-app_9f26eff6-2390-4460-8829-81a9cbe21751.jpg',
    };
    const headers = {
      Authorization: `Bearer ${responseLoginJson.access_token}`,
    };
    const responseArticle = await request.post(articlesUrl, {
      headers,
      data: articleData,
    });
    // Assert
    const actualResponseStatus = responseArticle.status();
    expect(
      actualResponseStatus,
      `status code expected ${expectedStatusCode}, but received ${actualResponseStatus}`,
    ).toBe(expectedStatusCode);
    // const article = await responseArticle.json();
    // expect.soft(article.title).toEqual(articleData.title);
    // expect.soft(article.body).toEqual(articleData.body);
  });
});
