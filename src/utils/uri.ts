export function stringifyQueryParams(params: Record<string, any>): string {
  const urlSearchParams = new URLSearchParams();

  const handleValue = (key: string, value: any): void => {
    if (Array.isArray(value)) {
      if (
        value.every(
          (item) => typeof item === 'string' || typeof item === 'number'
        )
      ) {
        urlSearchParams.append(key, value.join(','));
      } else {
        for (let i = 0; i < value.length; i++) {
          const subValue = value[i];
          handleValue(`${key}[${i}]`, subValue);
        }
      }
    } else if (typeof value === 'object' && value !== null) {
      for (const [subKey, subValue] of Object.entries(value)) {
        handleValue(`${key}[${subKey}]`, subValue);
      }
    } else {
      urlSearchParams.append(key, String(value));
    }
  };

  for (const [key, value] of Object.entries(params)) {
    handleValue(key, value);
  }

  return urlSearchParams.toString();
}

export function addQueryParams(
  endpoint: string,
  params: Record<string, any> | undefined
): string {
  if (!params) {
    return endpoint;
  }

  const query = stringifyQueryParams(params);

  if (query.length > 0) {
    return `${endpoint}?${query}`;
  }

  return endpoint;
}
