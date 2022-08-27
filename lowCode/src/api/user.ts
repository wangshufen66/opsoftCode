import { fetch } from '@/shared/utils/request';

export const getUserList = (params: any) => fetch('get', '/api/user/list', params);