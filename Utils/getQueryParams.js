export const getQueryParam = (url, param) => {
  const queryString = url.split('?')[1];
  if (!queryString) return null;
  const params = new URLSearchParams(queryString);
  return params.get(param);
};