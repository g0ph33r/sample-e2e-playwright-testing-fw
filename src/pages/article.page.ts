import { MainMenuComponent } from '../components/main-menu.component';
import { BasePage } from './base.page';
import { Page } from '@playwright/test';

export class ArticlePage extends BasePage {
  url = '/article.html';
  mainMenu = new MainMenuComponent(this.page);
  articleTitle = this.page.getByTestId('article-title');
  articleBody = this.page.getByTestId('article-body');
  user = this.page.getByTestId('user-name');
  deleteButton = this.page.getByTestId('delete');
  addCommentButton = this.page.locator('#add-new-comment');
  alertPopUp = this.page.getByTestId('alert-popup');

  constructor(page: Page) {
    super(page);
  }

  async deleteArticle(): Promise<void> {
    this.page.on('dialog', async (dialog) => {
      await dialog.accept();
    });
    this.deleteButton.click();
  }
}
