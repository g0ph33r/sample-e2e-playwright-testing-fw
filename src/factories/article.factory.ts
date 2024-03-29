import { AddArticleModel } from '@_src/models/article.model';
import { faker } from '@faker-js/faker';

export function prepareRandomNewArticle(
  titleLenght?: number,
  bodyParagraphs = 3,
): AddArticleModel {
  let title: string;
  if (titleLenght) title = faker.string.alpha(titleLenght);
  else title = faker.lorem.sentence();

  const body = faker.lorem.paragraphs(bodyParagraphs);

  const newArticle: AddArticleModel = { title: title, body: body };

  return newArticle;
}
