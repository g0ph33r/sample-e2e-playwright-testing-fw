import { MainMenuComponent } from '@_src/components/main-menu.component';
import { BasePage } from '@_src/pages/base.page';
import { Locator, Page } from '@playwright/test';

interface ArticleComment {
  body: Locator;
  link: Locator;
}
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

  getArticleComment(body: string): ArticleComment {
    const commentContainer = this.page
      .locator('.comment-container')
      .filter({ hasText: body });

    return {
      body: commentContainer.locator(':text("comment:") + span'),
      link: commentContainer.locator("[id^='gotoComment']"),
    };
  }
}
