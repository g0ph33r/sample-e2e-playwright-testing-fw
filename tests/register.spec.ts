import { randomUserData } from '../src/factories/user.factory';
import { RegisterUser } from '../src/models/user.model';
import { LoginPage } from '../src/pages/login.page';
import { RegisterPage } from '../src/pages/register.page';
import { WelcomePage } from '../src/pages/welcome.page';
import { expect, test } from '@playwright/test';

test.describe('Verify register', () => {
  let registerPage: RegisterPage;
  let registerUserData: RegisterUser;
  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    registerUserData = randomUserData();
    await registerPage.goto();
  });

  test('Register with correct data and login @GAD_R03_01 @GAD_R03_02 @GAD_R03_03', async ({
    page,
  }) => {
    //Arrange
    const expectedAlertPopupText = 'User created';

    const loginPage = new LoginPage(page);
    const welcomePage = new WelcomePage(page);

    const title = await loginPage.title();
    const titleWelcome = await welcomePage.title();

    //Act
    await registerPage.register(registerUserData);

    //Assert
    await expect(registerPage.alertPopup).toHaveText(expectedAlertPopupText);
    await loginPage.waitForUrl();
    expect(title).toContain('GAD | Register');

    await loginPage.login({
      userEmail: registerUserData.userEmail,
      userPassword: registerUserData.userPassword,
    });
    expect(titleWelcome).toContain('🦎 GAD | Register');
  });

  test('Not register with incorrect data - not valid email @GAD_R03_04', async () => {
    //Arrange
    const expectedErrorText = 'Please provide a valid email address';
    registerUserData.userEmail = 'inv@lid';

    //Act
    await registerPage.register(registerUserData);

    //Assert
    await expect(registerPage.emailErrorText).toHaveText(expectedErrorText);
  });

  test('Not register with incorrect data - email not provided @GAD_R03_04', async () => {
    //Arrange
    const expectedErrorText = 'This field is required';

    //Act
    await registerPage.goto();
    await registerPage.registerButton.click();
    await registerPage.userFirstNameInput.fill(registerUserData.userFirstName);
    await registerPage.userLastNameInput.fill(registerUserData.userLastName);
    await registerPage.userPasswordInput.fill(registerUserData.userPassword);
    await registerPage.registerButton.click();

    //Assert
    await expect(registerPage.emailErrorText).toHaveText(expectedErrorText);
  });
});
