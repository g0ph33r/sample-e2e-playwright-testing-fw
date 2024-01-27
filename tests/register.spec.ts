import { randomUserData } from '../src/factories/user.factory';
import { LoginPage } from '../src/pages/login.page';
import { RegisterPage } from '../src/pages/register.page';
import { WelcomePage } from '../src/pages/welcome.page';
import { expect, test } from '@playwright/test';

test.describe('Verify register', () => {
  test('Register with correct data and login @GAD_R03_01 @GAD_R03_02 @GAD_R03_03', async ({
    page,
  }) => {
    //Arrange
    const registerPage = new RegisterPage(page);
    const registerUserData = randomUserData();

    //Act
    await registerPage.goto();
    await registerPage.register(registerUserData);

    const expectedAlertPopupText = 'User created';

    //Assert
    await expect(registerPage.alertPopup).toHaveText(expectedAlertPopupText);
    const loginPage = new LoginPage(page);
    await loginPage.waitForUrl();
    const title = await loginPage.title();
    expect(title).toContain('🦎 GAD | Login');

    await loginPage.login({
      userEmail: registerUserData.userEmail,
      userPassword: registerUserData.userPassword,
    });
    const welcomePage = new WelcomePage(page);
    const titleWelcome = await welcomePage.title();
    expect(titleWelcome).toContain('🦎 GAD | Welcome');
  });

  test('Not register with incorrect data - not valid email @GAD_R03_04', async ({
    page,
  }) => {
    //Arrange
    const registerPage = new RegisterPage(page);
    const registerUserData = randomUserData();
    registerUserData.userEmail = 'inv@lid';
    const expectedErrorText = 'Please provide a valid email address';

    //Act
    await registerPage.goto();
    await registerPage.register(registerUserData);

    //Assert
    await expect(registerPage.emailErrorText).toHaveText(expectedErrorText);
  });

  test('Not register with incorrect data - email not provided @GAD_R03_04', async ({
    page,
  }) => {
    //Arrange
    const registerPage = new RegisterPage(page);
    const registerUserData = randomUserData();
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
