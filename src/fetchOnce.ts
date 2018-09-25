export default function (doFetch) {
    let promiseStore = null;

    return function () {
        if (!promiseStore) {
            promiseStore = doFetch();
        }
        return promiseStore;
    }
}