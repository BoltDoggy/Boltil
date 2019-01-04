import store from 'store';

import fetchOnce from './fetchOnce';

export default function (cacheKey, doFetch, refreshSwitch = true) {
    const aFetchOnce = fetchOnce(doFetch, true);

    return function () {
        const ret = store.get(cacheKey);
        if (ret) {
            if (refreshSwitch) {
                aFetchOnce().then((data) => {
                    store.set(cacheKey, data);
                });
            }
            return Promise.resolve(ret);
        } else {
            return aFetchOnce().then((data) => {
                store.set(cacheKey, data);
                return data;
            });
        }
    }
};
