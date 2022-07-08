const keyStorage = 'cart';

//handle localStorage
function storage(method = 'get',value = null) {
    if(method === 'get') return JSON.parse(localStorage.getItem(keyStorage));
    else if(method === 'set' && value) return localStorage.setItem(keyStorage,JSON.stringify(value))
    else if(method === 'delete') return localStorage.removeItem(keyStorage);
}

export {storage};