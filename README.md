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

### `f()` = fetchOnce(`Function`, `RefreshSwitch = false`)

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
const aFetchOnce = fetchOnce(() => aFetch(...));
// 使用 aFetchOnce() 取代 aFetch(...);
// 或
const anotherFetchOnce = fetchOnce(() => aFetch(...), true);
// 使用 anotherFetchOnce() 取代 aFetch(...);
```

#### 可选参数 RefreshSwitch

默认为 false, 当主动传入 true 时, 表示第一次网络请求结束后, 再次调用会发起新的请求

```
s1------e1
  s2    e1
    s3  e1
      s4e1
        s5e1
          s6e6
            s7e6
              s8e8
                        s9e9
```

### `f()` = cacheFirst(`[ CacheKey | CacheHandler ]`, `Function`, `RefreshSwitch = true`)

缓存优先, 第一次请求, 在没有缓存的情况下, 请求正常发出.

之后的请求发现本地缓存存在, 立即返回本地缓存数据, 同时请求发出, 返回后更新本地缓存.

同时发出的网络请求参见 fetchOnce(`Function`, true) 的情况

``` js
// example
// aFetch 是一个普通的网络请求方法
const aCacheFirst = cacheFirst('aString', () => aFetch(...));
// 使用 aCacheFirst() 取代 aFetch(...);
// 或
const anotherCacheFirst = cacheFirst('aString', () => aFetch(...), false);
// 使用 anotherCacheFirst() 取代 aFetch(...);
```

#### CacheKey or CacheHandler

使用 CacheKey, 传入 string, 作为 key, 并使用 [store](https://www.npmjs.com/package/store) 对本地存储操作

使用 CacheHandler, 传入 object, 可以自定义对 Cache 的 getter, setter

``` js
// example
// aFetch 是一个普通的网络请求方法
const aCacheFirst = cacheFirst({
  get() {
    return /* */;
  },
  set(data) {
    /* */;
  }
}, () => aFetch(...));
// 使用 aCacheFirst() 取代 aFetch(...);
// 更详细的例子
const anotherCacheFirst = cacheFirst({
  // 将缓存数据存储在临时属性 _data 中, 页面刷新后失效
  _data: null,
  get() {
    return this._data;
  },
  set(data) {
    this._data = data;
  }
}, () => aFetch(...));
// 使用 anotherCacheFirst() 取代 aFetch(...);
```

#### 可选参数 RefreshSwitch

默认为 true, 当主动传入 false 时, 表示不再更新本地缓存.

即首次网络请求发出后, 不再发出网络请求.

> 因为使用本地存储, 只有清空本地存储的情况才会更新数据, 请酌情慎用.

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