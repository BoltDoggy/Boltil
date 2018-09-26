# Boltil

> Bolt 工具箱

## 使用

```
npm i @boltdoggy/boltil -S
```

``` js
// example1
import * as Boltil from '@boltdoggy/boltil'
Boltil.debounceAsync(...)

// example2
import {
  debounceAsync,
  fetchOnce
} from '@boltdoggy/boltil'
debounceAsync(...)

// example3
import debounceAsync from '@boltdoggy/boltil/lib/debounceAsync'
debounceAsync(...)
```

## API

> 以下图示中 `sn` 表示请求发出, `--` 表示等待返回, `en` 表示返回结果, ` ` 表示空闲等待.

```
sn       ------en
```

- 如果没有 `--` 表示请求没有发出, 如果没有 `en` 表示没有结果返回.
- 如 `snen` 表示请求没有发出, 但是立即返回了缓存中的结果.
- 如 `sn  --en` 表示请求前等待了一个时间单元.


### `f(...args)` = debounceAsync(`Function`)

异步防抖

连续不断的请求, 一个请求发出后, 结果返回前的请求都被忽略, 直到结果返回的时刻, 此时最后一次请求将被触发.

```
s1------e1
  s2
    s3
      s4
        s5------e5
          s6
            s7  ------e7
                            s8------e8
                              s9    ------e9
```

`f(...args)` 传入的参数 `...args` 将会原样传入原函数 `Function`

``` js
// example
// aFetch 是一个普通的网络请求方法
const aFetchDebounced = debounceAsync(aFetch);
// 使用 aFetchDebounced(...) 取代 aFetch(...);
```

### `f()` = fetchOnce(`Function`)

只请求一次, 再次以及更多的请求忽略.

```
s1------e1
  s2    e1
    s3  e1
      s4e1
        s5e1
          s6e1
            s7e1
              s8e1
                        s9e1
```

因为请求只发出一次, `f()` 传入参数也无法生效, 因此该方法不提供传入参数支持.

``` js
// example
// aFetch 是一个普通的网络请求方法
const aFetchOnce = debounceAsync(() => aFetch(...));
// 使用 aFetchOnce() 取代 aFetch(...);
```

### forEachAsync(`Array`, `StepFunction`, `DoneFunction`)

按 `Array` 中元素顺序依次执行 `StepFunction(element, index, nextCallback)`

- `element` 表示当前元素
- `index` 表示当前元素在 `Array` 中的位置
- `nextCallback(err)` 在异步处理完成后调用
    - 如果 `err` 不为空, 则表示异常跳出, 不再使用 `Array` 的下一个元素执行 `StepFunction(...)`, 而是直接执行 `DoneFunction(err)`

``` js
// example
forEachAsync([...], (element, index, next) => {
  doSomeThingAsync(() => {
    next();
  });
}, () => {
  doSomeThing();
})
```