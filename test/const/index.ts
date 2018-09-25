export const aFetch = (arg0, ...args) => new Promise((resolve) => {
    setTimeout(() => {
        resolve({
            data: 'ok',
            arg0,
            args
        });
    }, 10);
});
