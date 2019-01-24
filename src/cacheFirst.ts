import store from 'store';

import _cacheFirst from './_cacheFirst';

export default function (arg0, doFetch, refreshSwitch = true) {
    if (typeof arg0 === 'string') {
        const cacheKey = arg0;

        return _cacheFirst({
            get() {
                return store.get(cacheKey);
            },
            set(data) {
                store.set(cacheKey, data);
            }
        }, doFetch, refreshSwitch);
    } else {
        return _cacheFirst(arg0, doFetch, refreshSwitch);
    }
};
