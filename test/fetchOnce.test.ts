import fetchOnce from '../src/fetchOnce';

import { aFetch } from './const';

test('do fetch 5 times', () => {
    expect.assertions(5);

    let trueFetchTimes = 0;
    const aFetchOnce = fetchOnce(() => aFetch(trueFetchTimes += 1));

    /**
     * 连续调用 5 次
     */
    const promiseArr = Array(5).fill(0).map((v, i) =>
        aFetchOnce().then((res:any) =>
            expect(res.arg0).toBe(1)
        )
    );

    /**
     * 实际只调用 1 次, 所有请求同时得到返回结果
     */
    return Promise.all(promiseArr);
});
