import { LoginUser } from '../models/user.model';
import { BasePage } from './base.page';
import { Page } from 'playwright/test';

export class LoginPage extends BasePage {
  url = '/login/';
  userEmail = this.page.getByPlaceholder('Enter User Email');
  userPassword = this.page.getByPlaceholder('Enter Password');
  loginButton = this.page.getByRole('button', { name: 'LogIn' });

  loginError = this.page.getByTestId('login-error');

  constructor(page: Page) {
    super(page);
  }

  async login(loginUserData: LoginUser): Promise<void> {
    await this.userEmail.fill(loginUserData.userEmail);
    await this.userPassword.fill(loginUserData.userPassword);
    await this.loginButton.click();
  }
}
