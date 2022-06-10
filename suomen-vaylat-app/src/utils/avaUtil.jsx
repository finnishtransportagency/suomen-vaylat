const avaFileSizes = {};

/**
 * Fetch download file size from AVA api url
 * @param {String} downloadUrl download url
 * @returns file size in bytes
 */
export async function fetchAvaFileSize(downloadUrl) {
    if (avaFileSizes[downloadUrl]) {
        return avaFileSizes[downloadUrl];
    }
    let temp = downloadUrl.replace('https://ava.vaylapilvi.fi/ava', 'https://api.vaylapilvi.fi/ava/hakemisto/ava');
    let splitted = temp.split('/');
    const fileName = splitted[splitted.length - 1];
    delete splitted[splitted.length - 1];
    let apiUrl = splitted.join('/');

    const response = await fetch(apiUrl);
    if (!response.ok) {
        const message = `An error has occured when fetching file size: ${response.status}`;
        throw new Error(message);
    }
    const resp = await response.json();
    const files = resp.aineisto;

    try {
        avaFileSizes[downloadUrl] = files.filter(f => f.tiedosto.includes(fileName))[0].size;
        return avaFileSizes[downloadUrl];
    } catch (err) {
        return null;
    }
}