export default (doFetch) => {
    /**
     * 异步锁
     */
    let lock = false;

    /**
     * 是否被打开执行
     */
    let open = false;

    /**
     * 储存最后一次参数;
     */
    let argStore;

    /**
     * 存储最后一次 resolve 方法
     */
    let resolveStore;

    function doCallback(_res, _resolveStore) {
        /**
         * 执行开关被打开, 且未被已异步锁住, 才会执行
         * 执行时打开异步锁, 为了防止异步多次被执行6
         * 执行时关闭执行开关, 表示没有下一次执行任务
         */
        if (open && !lock) {
            lock = true;
            open = false;
            return doFetch(...argStore).then((res) => {
                /**
                 * 异步执行完成, 管理异步锁
                 * 进入下一次执行
                 */
                lock = false;
                _resolveStore && _resolveStore(res);
                return doCallback(res, resolveStore);
            });
        } else if (_res) {
            return Promise.resolve(_res);
        } else {
            return new Promise(() => {});
        }
    }

    return (...args) => {
        /**
         * 方法被调用时, 打开执行开关
         * 并执行
         */
        open = true;
        argStore = args;
        return new Promise((resolve) => {
            resolveStore = resolve;
            doCallback(undefined, resolveStore);
        });
        // return doCallback(undefined);
    }
}