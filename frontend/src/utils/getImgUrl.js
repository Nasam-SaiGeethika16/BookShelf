import getBaseUrl from "./baseURL";

function getImgUrl (name) {
    if (name.startsWith('http')) {
        return name;
    }
    return `${getBaseUrl()}/${name}`;
}

export {getImgUrl}