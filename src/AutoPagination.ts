type YumiSignCachedPromise = {
  current: Promise<any> | undefined | null;
};

type YumiSignPaginatedList<T> = {
  total: number;
  limit: number;
  pages: number;
  items: Array<T>;
};

type YumiSignAutoPaginationEach<T> = (
  handler: (item: T) => boolean | void | Promise<boolean | void>
) => Promise<void>;

type YumiSignAutoPaginationToArray<T> = (options?: {
  limit?: number;
}) => Promise<Array<T>>;

type YumiSignAutoPaginationMethods<T> = {
  each: YumiSignAutoPaginationEach<T>;
  toArray: YumiSignAutoPaginationToArray<T>;
  next: () => Promise<IteratorResult<T>>;
  return: () => any;
};

class YumiSignAutoPaginationIterator<T> implements AsyncIterator<T> {
  private index: number;
  private page: number;
  private readonly yumisignResource: YumiSignResourceObject;
  private pagePromise: Promise<YumiSignPaginatedList<T>>;
  private cachedPromise: YumiSignCachedPromise;
  private readonly request: (
    params: YumiSignPaginationParams
  ) => Promise<YumiSignPaginatedList<T>>;
  private readonly requestParams: YumiSignPaginationParams;

  constructor(
    yumisignResource: YumiSignResourceObject,
    startPagePromise: Promise<YumiSignPaginatedList<T>>,
    request: (
      params: YumiSignPaginationParams
    ) => Promise<YumiSignPaginatedList<T>>,
    requestParams?: YumiSignPaginationParams
  ) {
    if (requestParams && requestParams.limit && requestParams.limit > 100) {
      throw new Error(
        'YumiSign Node: You cannot specify a limit of more than 100 items.'
      );
    }

    this.index = 0;
    this.page = requestParams?.page || 1;
    this.yumisignResource = yumisignResource;
    this.pagePromise = startPagePromise;
    this.cachedPromise = {current: null};
    this.request = request;
    this.requestParams = requestParams || ({} as YumiSignPaginationParams);
  }

  next(): Promise<IteratorResult<T>> {
    if (this.cachedPromise.current) {
      return this.cachedPromise.current;
    }

    const nextPromise = (async (): Promise<IteratorResult<T>> => {
      const promise = await this.iterate(await this.pagePromise);
      this.cachedPromise.current = null;
      return promise;
    })();

    this.cachedPromise.current = nextPromise;

    return nextPromise;
  }

  async iterate(
    paginatedList: YumiSignPaginatedList<T>
  ): Promise<IteratorResult<T>> {
    if (!(paginatedList && paginatedList.items)) {
      throw new Error('YumiSign Node: Unsupported api response');
    }

    if (this.index < paginatedList.items.length) {
      const item = paginatedList.items[this.index];
      this.index += 1;
      return {done: false, value: item};
    } else if (this.page * paginatedList.limit < paginatedList.total) {
      this.index = 0;
      this.page += 1;
      this.pagePromise = this.request.apply(this.yumisignResource, [
        {...this.requestParams, page: this.page},
      ]);
      const nextPaginatedList = await this.pagePromise;
      return this.iterate(nextPaginatedList);
    }

    return {done: true, value: undefined};
  }
}

function getAsyncIteratorSymbol(): symbol | string {
  if (typeof Symbol !== 'undefined' && Symbol.asyncIterator) {
    return Symbol.asyncIterator;
  }
  return '@@asyncIterator';
}

function makeAutoPaginationEach<T>(
  iterator: YumiSignAutoPaginationIterator<T>
): YumiSignAutoPaginationEach<T> {
  return function(
    itemIterator: (item: T) => boolean | void | Promise<boolean | void>
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      function handleIteration(
        iteratorResult: IteratorResult<T>
      ): Promise<any> | void {
        if (iteratorResult.done) {
          resolve();
          return;
        }

        const item = iteratorResult.value;
        return new Promise((next) => {
          const shouldContinue = itemIterator(item);
          next(shouldContinue);
        }).then((itemIteratorResult) => {
          if (itemIteratorResult === false) {
            return handleIteration({done: true, value: undefined});
          } else {
            return iterator.next().then(handleIteration);
          }
        });
      }

      iterator
        .next()
        .then(handleIteration)
        .catch(reject);
    });
  };
}

function makeAutoPaginationToArray<T>(
  autoPaginationEach: YumiSignAutoPaginationEach<T>
): YumiSignAutoPaginationToArray<T> {
  return function(options?: {limit?: number}): Promise<Array<T>> {
    const limit = options?.limit ?? 1000;
    if (limit > 1000) {
      throw new Error(
        'YumiSign Node: You cannot specify a limit of more than 1000 items.'
      );
    }

    return new Promise<Array<T>>((resolve, reject) => {
      const items: Array<T> = [];
      autoPaginationEach((item) => {
        items.push(item);
        if (items.length >= limit) {
          return false;
        }
      })
        .then(() => {
          resolve(items);
        })
        .catch(reject);
    });
  };
}

export const makeAutoPaginationMethods = <T>(
  yumisignResource: YumiSignResourceObject,
  startPagePromise: Promise<YumiSignPaginatedList<T>>,
  request: (
    params: YumiSignPaginationParams
  ) => Promise<YumiSignPaginatedList<T>>,
  requestParams?: YumiSignPaginationParams
): YumiSignAutoPaginationMethods<T> => {
  const iterator = new YumiSignAutoPaginationIterator<T>(
    yumisignResource,
    startPagePromise,
    request,
    requestParams
  );

  const each = makeAutoPaginationEach<T>(iterator);
  const toArray = makeAutoPaginationToArray<T>(each);

  const autoPaginationMethods: YumiSignAutoPaginationMethods<T> = {
    each,
    toArray,
    next: (): Promise<IteratorResult<T>> => iterator.next(),
    return: (): any => ({}),
    [getAsyncIteratorSymbol()]: () => {
      return autoPaginationMethods;
    },
  };

  return autoPaginationMethods;
};
