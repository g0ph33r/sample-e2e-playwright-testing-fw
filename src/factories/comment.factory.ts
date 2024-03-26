import { AddCommentModel } from '@_src/models/comment.model';
import { faker } from '@faker-js/faker';

export function prepareRandomComment(bodySentences = 3): AddCommentModel {
  const body = faker.lorem.sentences(bodySentences);
  const newComment: AddCommentModel = { body: body };

  return newComment;
}
