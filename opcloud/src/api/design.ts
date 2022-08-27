import request, { ResponseType } from '@/shared/utils/request';

export const getTableList = (): Promise<ResponseType> =>
  request().get('/api/table/list');

export const getTableField = (): Promise<ResponseType> =>
  request().get('/api/table/fields');

export const getLinkageData = (params?: any): Promise<ResponseType> =>
  request().post('/api/opcloud/application/linkage/data', params);

export const getProcessPercentage = (params?: any): Promise<ResponseType> =>
  request().get('/api/opcloud/application/linkage/procPercentage', { params });
