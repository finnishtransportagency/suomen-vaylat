/**
 * Fetch request headers.
 */
 export const getHeaders = () => {
    const headers = new Headers();
    headers.append('X-Requested-With', 'XMLHttpRequest');
    headers.append('Content-Type', 'application/json; charset=utf-8');
    return headers;
};


export const getUrlParameter = (param: string) => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    return params.get(param);
};