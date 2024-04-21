import { expect, test } from '@_src/fixtures/merge.fixture';

test.describe('Verify service main pages', () => {
  test('Verify home page title @GAD-R01-01', async ({ homePage }) => {
    //Arrange
    const expectedHomePageTitle = 'GAD';

    //Act
    await homePage.goto();

    //Assert

    const title = await homePage.getTitle();
    expect(title).toContain(expectedHomePageTitle);
  });

  test('Verify articles page title @GAD-R01-02', async ({ articlesPage }) => {
    //Arrange
    const expectedArticlesTitle = '🦎 GAD | Articles';

    //Assert
    const title = await articlesPage.getTitle();
    expect(title).toContain(expectedArticlesTitle);
  });

  test('Verify comments page title @GAD-R01-02', async ({ commentsPage }) => {
    //Arrange
    const expectedCommentsTitle = '🦎 GAD | Comments';

    //Assert
    const title = await commentsPage.getTitle();
    expect(title).toContain(expectedCommentsTitle);
  });

  test('Home page title simple', async ({ page }) => {
    //Act
    await page.goto('');
    await expect(page).toHaveTitle(/GAD/);
  });
});
