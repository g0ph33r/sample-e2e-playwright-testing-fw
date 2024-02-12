import { USER_NAME, USER_PASSWORD } from '../env.config';
import { LoginUserModel } from '../models/user.model';

export const testUser1: LoginUserModel = {
  userEmail: USER_NAME,
  userPassword: USER_PASSWORD,
};
