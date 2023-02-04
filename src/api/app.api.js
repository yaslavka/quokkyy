import {baseInstance} from './index';

export const userInfo = async () =>
  await baseInstance({url: '/user', method: 'get'});
export const changeUserInfo = data =>
  baseInstance({url: '/user/fio', method: 'post', data});
export const changePassword = data =>
  baseInstance({url: '/user/password', method: 'post', data});
