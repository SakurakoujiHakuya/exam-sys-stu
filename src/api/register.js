import { post } from '../utils/request';

export default {
  register: query => post(`/api/student/user/register`, query)
};