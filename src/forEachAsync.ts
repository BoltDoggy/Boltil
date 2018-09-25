export default function (arr, callback, done) {
    let index = 0;
    function next(i) {
        if (i < arr.length) {
            callback(arr[i], i, (err) => {
                if (err) {
                    done(err);
                } else {
                    next(i += 1);
                }
            });
        } else {
            done(null);
        }
    }
    next(index);
    index += 1;
}
