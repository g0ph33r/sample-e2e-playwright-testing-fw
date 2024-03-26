import { USER_NAME, USER_PASSWORD } from '../../config/env.config';
import { LoginUserModel } from '@_src/models/user.model';

export const testUser1: LoginUserModel = {
  userEmail: USER_NAME,
  userPassword: USER_PASSWORD,
};
