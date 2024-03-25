import { prepareRandomUser } from '../../src/factories/user.factory';
import { RegisterUserModel } from '../../src/models/user.model';
import { LoginPage } from '../../src/pages/login.page';
import { RegisterPage } from '../../src/pages/register.page';
import { WelcomePage } from '../../src/pages/welcome.page';
import { expect, test } from '@playwright/test';

test.describe('Verify register', () => {
  let registerPage: RegisterPage;
  let registerUserData: RegisterUserModel;
  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    registerUserData = prepareRandomUser();
    await registerPage.goto();
  });

  test('Register with correct data and login @GAD-R03-_01 @GAD-R03-_02 @GAD-R03-_03', async ({
    page,
  }) => {
    //Arrange
    const expectedAlertPopupText = 'User created';

    const loginPage = new LoginPage(page);
    const welcomePage = new WelcomePage(page);

    const title = await loginPage.getTitle();
    const titleWelcome = await welcomePage.getTitle();

    //Act
    await registerPage.register(registerUserData);

    //Assert
    const expectedRegisterTitle = 'GAD | Register';
    const expectedTitleWelcome = '🦎 GAD | Register';

    await expect(registerPage.alertPopup).toHaveText(expectedAlertPopupText);
    await loginPage.waitForUrl();
    expect(title).toContain(expectedRegisterTitle);

    await loginPage.login({
      userEmail: registerUserData.userEmail,
      userPassword: registerUserData.userPassword,
    });
    expect(titleWelcome).toContain(expectedTitleWelcome);
  });

  test('Not register with incorrect data - not valid email @GAD-R03-_04', async () => {
    //Arrange
    const expectedErrorText = 'Please provide a valid email address';
    registerUserData.userEmail = 'inv@lid';

    //Act
    await registerPage.register(registerUserData);

    //Assert
    await expect(registerPage.emailErrorText).toHaveText(expectedErrorText);
  });

  test('Not register with incorrect data - email not provided @GAD-R03-_04', async () => {
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
