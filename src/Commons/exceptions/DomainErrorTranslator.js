const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada',
  ),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat user baru karena tipe data tidak sesuai',
  ),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError(
    'tidak dapat membuat user baru karena karakter username melebihi batas limit',
  ),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError(
    'tidak dapat membuat user baru karena username mengandung karakter terlarang',
  ),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'harus mengirimkan username dan password',
  ),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'username dan password harus string',
  ),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN':
    new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION':
    new InvariantError('refresh token harus string'),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN':
    new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION':
    new InvariantError('refresh token harus string'),
  'THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada',
  ),
  'THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat thread baru karena tipe data tidak sesuai',
  ),
  'THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat komentar karena properti yang dibutuhkan tidak ada',
  ),
  'THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat komentar karena tipe data tidak sesuai',
  ),
  'DELETE_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat menghapus komentar karena properti yang dibutuhkan tidak ada',
  ),
  'DELETE_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat menghapus komentar karena tipe data tidak sesuai',
  ),
  'GET_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat mengambil data thread karena properti yang dibutuhkan tidak ada',
  ),
  'GET_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat mengambil data thread karena tipe data tidak sesuai',
  ),
  'THREAD_COMMENT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat melakukan like comment karena properti yang dibutuhkan tidak ada',
  ),
  'THREAD_COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat melakukan like comment karena tipe data properti tidak sesuai',
  ),
};

module.exports = DomainErrorTranslator;
