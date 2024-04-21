import { prepareRandomUser } from '@_src/factories/user.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';
import { RegisterUserModel } from '@_src/models/user.model';

test.describe('Verify register', () => {
  let registerUserData: RegisterUserModel;
  test.beforeEach(async () => {
    registerUserData = prepareRandomUser();
  });

  test('Register with correct data and login @GAD-R03-_01 @GAD-R03-_02 @GAD-R03-_03', async ({
    registerPage,
  }) => {
    //Arrange
    const expectedAlertPopupText = 'User created';
    const expectedLoginTitle = '🦎 GAD | Login';
    const expectedWelcomeTitle = '🦎 GAD | Welcome';

    //Act
    const loginPage = await registerPage.register(registerUserData);

    //Assert

    await expect(registerPage.alertPopup).toHaveText(expectedAlertPopupText);
    await loginPage.waitForUrl();
    const title = await loginPage.getTitle();
    expect(title).toContain(expectedLoginTitle);

    const welcomePage = await loginPage.login({
      userEmail: registerUserData.userEmail,
      userPassword: registerUserData.userPassword,
    });

    const titleWelcome = await welcomePage.getTitle();
    expect(titleWelcome).toContain(expectedWelcomeTitle);
  });

  test('Not register with incorrect data - not valid email @GAD-R03-_04', async ({
    registerPage,
  }) => {
    //Arrange
    const expectedErrorText = 'Please provide a valid email address';
    registerUserData.userEmail = 'inv@lid';

    //Act
    await registerPage.register(registerUserData);

    //Assert
    await expect(registerPage.emailErrorText).toHaveText(expectedErrorText);
  });

  test('Not register with incorrect data - email not provided @GAD-R03-_04', async ({
    registerPage,
  }) => {
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
