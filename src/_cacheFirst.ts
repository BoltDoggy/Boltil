import fetchOnce from './fetchOnce';

export default function (
    cacheHandler: { set: Function, get: Function }, 
    doFetch: Function, 
    refreshSwitch: boolean = true
) {
    const aFetchOnce = fetchOnce(doFetch, true);

    return function () {
        const ret = cacheHandler.get();
        if (ret) {
            if (refreshSwitch) {
                aFetchOnce().then((data) => {
                    cacheHandler.set(data);
                });
            }
            return Promise.resolve(ret);
        } else {
            return aFetchOnce().then((data) => {
                cacheHandler.set(data);
                return data;
            });
        }
    }
}