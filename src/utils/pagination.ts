import YumiSign, {YumiSignResource} from 'yumisign';
import {makeAutoPaginationMethods} from '../AutoPagination.js';

export function makeAutoPaginatePromise<T>(
  requestPromise: Promise<YumiSign.Response<YumiSign.PaginatedList<T>>>,
  resource: YumiSignResource,
  request: (
    params?: YumiSign.PaginationParams
  ) => Promise<YumiSign.Response<YumiSign.PaginatedList<T>>>,
  requestParams?: YumiSign.PaginationParams
): YumiSign.PaginatedListPromise<T> {
  return Object.assign(requestPromise, {
    autoPagination: makeAutoPaginationMethods<T>(
      (resource as unknown) as YumiSignResourceObject,
      requestPromise,
      request,
      requestParams as YumiSignPaginationParams
    ),
  }) as YumiSign.PaginatedListPromise<T>;
}
