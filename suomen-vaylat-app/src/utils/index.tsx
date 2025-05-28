export const getUrlParameter = (param: string) => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    return params.get(param);
};