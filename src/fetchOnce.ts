export default function (doFetch, refreshSwitch = false) {
    let promiseStore = null;

    return function () {
        if (!promiseStore) {
            promiseStore = doFetch().then((data) => {
                if (refreshSwitch) {
                    promiseStore = null;
                }
                return data
            });
        }
        return promiseStore;
    }
}