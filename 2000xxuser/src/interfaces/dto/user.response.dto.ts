import { HttpStatus } from '@nestjs/common';
import { IsString } from 'class-validator';
import { UserDTO } from './user.dto';
import { IUser } from '../../../../agxxsol/src/interfaces/user/user.interface';

export const userNotFound = {
  status: HttpStatus.NOT_FOUND,
  message: 'user_not_found',
  error: null,
};

//============================================================CREATE SECTION

export const userCreateRequestSuccess = {
  status: HttpStatus.OK,
  message: 'user_create_success',
  error: null,
};

export const userCreateRequestFailed = {
  status: HttpStatus.BAD_REQUEST,
  message: 'user_create_failed',
  error: null,
};

export const userCreateRequestDup = {
  status: HttpStatus.FORBIDDEN,
  message: 'user_duplicated',
  error: null,
};

//============================================================UPDATE SECTION

export const userUpdateRequestSuccess = {
  status: HttpStatus.OK,
  message: 'user_update_success',
  user: {},
  error: null,
};

export const userUpdateRequestFailed = {
  status: HttpStatus.BAD_REQUEST,
  message: 'user_update_failed',
  user: null,
  error:
    'User failed to delete. Might be your provided data is not valid to system',
};

//============================================================DELETE SECTION

export const userDeleteRequestSuccess = {
  status: HttpStatus.OK,
  message: 'user_delete_success',
  error: null,
};

export const userDeleteRequestFailed = {
  status: HttpStatus.BAD_REQUEST,
  message: 'user_delete_failed',
  error:
    'User failed to delete. Might be your provided data is not valid to system',
};

//============================================================LOGIN SECTION

export const userLoginRequestSuccess = {
  status: HttpStatus.OK,
  message: 'user_login_success',
  user: {},
  token: '',
  error: null,
};

export const userLoginRequestFailed = {
  status: HttpStatus.FORBIDDEN,
  message: 'user_login_failed',
  user: null,
  token: null,
  error: 'User email/password is wrong',
};
