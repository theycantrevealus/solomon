import { HttpStatus } from '@nestjs/common';

export const authorityNotFound = {
  status: HttpStatus.NOT_FOUND,
  message: 'authority_not_found',
  error: null,
};

//============================================================CREATE SECTION

export const authorityCreateRequestSuccess = {
  status: HttpStatus.OK,
  message: 'authority_create_success',
  error: null,
};

export const authorityCreateRequestFailed = {
  status: HttpStatus.BAD_REQUEST,
  message: 'authority_create_failed',
  error: null,
};

export const authorityCreateRequestDup = {
  status: HttpStatus.FORBIDDEN,
  message: 'authority_duplicated',
  error: null,
};

//============================================================UPDATE SECTION

export const authorityUpdateRequestSuccess = {
  status: HttpStatus.OK,
  message: 'authority_update_success',
  user: {},
  error: null,
};

export const authorityUpdateRequestFailed = {
  status: HttpStatus.BAD_REQUEST,
  message: 'authority_update_failed',
  user: null,
  error:
    'User failed to delete. Might be your provided data is not valid to system',
};

//============================================================DELETE SECTION

export const authorityDeleteRequestSuccess = {
  status: HttpStatus.OK,
  message: 'authority_delete_success',
  error: null,
};

export const authorityDeleteRequestFailed = {
  status: HttpStatus.BAD_REQUEST,
  message: 'authority_delete_failed',
  error:
    'User failed to delete. Might be your provided data is not valid to system',
};
