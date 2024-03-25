import { LoginUserModel } from '../../src/models/user.model';
import { LoginPage } from '../../src/pages/login.page';
import { WelcomePage } from '../../src/pages/welcome.page';
import { testUser1 } from '../../src/test-data/user.data';
import { expect, test } from '@playwright/test';

test.describe('Verify login', () => {
  test('Login with correct credentials @GAD-R02-01', async ({ page }) => {
    // Arrange

    const loginPage = new LoginPage(page);
    const expectedWelcomeTitle = '🦎 GAD | Welcome';
    const welcomePage = new WelcomePage(page);

    // Act
    await loginPage.goto();
    await loginPage.login(testUser1);

    const title = await welcomePage.getTitle();

    //Assert
    expect(title).toContain(expectedWelcomeTitle);
  });
});

test('Reject login with incorrect password @GAD-R02-02', async ({ page }) => {
  // Arrange

  const loginPage = new LoginPage(page);
  const loginUserData: LoginUserModel = {
    userEmail: testUser1.userEmail,
    userPassword: 'incorrectPass',
  };
  const expectedLoginTitle = '🦎 GAD | Login';
  const expectedLoginError = 'Invalid username or password';

  // Act
  await loginPage.goto();
  await loginPage.login(loginUserData);

  //Assert
  await expect.soft(loginPage.loginError).toHaveText(expectedLoginError);
  const title = await loginPage.getTitle();
  expect(title).toContain(expectedLoginTitle);
});
