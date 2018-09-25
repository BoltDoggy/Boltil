import forEachAsync from '../src/forEachAsync';

import { aFetch } from './const';

test('do fetch 5 times', () => {
    expect.assertions(5);

    const arr = Array(5).fill(0).map((v, i) => i).sort(() => ~~(Math.random()*3)-1);

    return new Promise((resolve, reject) => {
        forEachAsync(arr, (element, index, next) => {
            aFetch(element).then((res:any) => {
                expect(res.arg0).toBe(arr[index]);
                next();
            });
        }, (err) => {
            if (err) {
                reject();
            } else {
                resolve();
            }
        })
    });
});
