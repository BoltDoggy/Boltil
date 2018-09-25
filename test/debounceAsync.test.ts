import debounceAsync from '../src/debounceAsync';

import { aFetch } from './const';

test('do fetch 5 times', () => {
    expect.assertions(2);

    const aFetchDebounced = debounceAsync(aFetch);

    /**
     * 连续调用 5 次
     */
    const promiseArr = Array(5).fill(0).map((v, i) =>
        aFetchDebounced(i).then((res:any) =>
            expect(res.arg0).toBe(i)
        )
    );

    /**
     * 最后一个 promise 必定触发, 且最后一次触发
     */
    return promiseArr[promiseArr.length - 1];
});
