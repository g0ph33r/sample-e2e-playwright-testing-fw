import { RegisterUser } from '../src/models/user.model';
import { LoginPage } from '../src/pages/login.page';
import { RegisterPage } from '../src/pages/register.page';
import { WelcomePage } from '../src/pages/welcome.page';
import { faker } from '@faker-js/faker/locale/en';
import { expect, test } from '@playwright/test';

test.describe('Verify register', () => {
  test('Register with correct data and login @GAD_R03_01 @GAD_R03_02 @GAD_R03_03', async ({
    page,
  }) => {
    //Arrange
    const registerPage = new RegisterPage(page);

    const registerUserData: RegisterUser = {
      userFirstName: faker.person.firstName().replace(/[^A-Za-z]/g, ''),
      userLastName: faker.person.lastName().replace(/[^A-Za-z]/g, ''),
      userEmail: '',
      userPassword: faker.internet.password(),
    };

    registerUserData.userEmail = faker.internet.email({
      firstName: registerUserData.userFirstName,
      lastName: registerUserData.userLastName,
    });
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

    const registerUserData: RegisterUser = {
      userFirstName: faker.person.firstName().replace(/[^A-Za-z]/g, ''),
      userLastName: faker.person.lastName().replace(/[^A-Za-z]/g, ''),
      userEmail: 'invalid$',
      userPassword: faker.internet.password(),
    };
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
    const expectedErrorText = 'This field is required';

    //Act
    await registerPage.goto();
    await registerPage.registerButton.click();
    await registerPage.userFirstNameInput.fill(
      faker.person.firstName().replace(/[^A-Za-z]/g, ''),
    );
    await registerPage.userLastNameInput.fill(
      faker.person.firstName().replace(/[^A-Za-z]/g, ''),
    );
    await registerPage.userPasswordInput.fill(faker.internet.password());
    await registerPage.registerButton.click();

    //Assert
    await expect(registerPage.emailErrorText).toHaveText(expectedErrorText);
  });
});
