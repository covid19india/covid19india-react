<p align="center">
  <a href="https://invertase.io">
    <img src="https://static.invertase.io/assets/invertase-logo-small.png"><br/>
  </a>
  <h2 align="center">Denque</h2>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/denque"><img src="https://img.shields.io/npm/dm/denque.svg?style=flat-square" alt="NPM downloads"></a>
  <a href="https://www.npmjs.com/package/denque"><img src="https://img.shields.io/npm/v/denque.svg?style=flat-square" alt="NPM version"></a>
  <a href="https://travis-ci.org/Salakar/denque"><img src="https://travis-ci.org/invertase/denque.svg" alt="Build version"></a>
  <a href="https://coveralls.io/github/invertase/denque?branch=master"><img src="https://coveralls.io/repos/github/invertase/denque/badge.svg?branch=master" alt="Build version"></a>  
  <a href="/LICENSE"><img src="https://img.shields.io/npm/l/denque.svg?style=flat-square" alt="License"></a>
  <a href="https://discord.gg/C9aK28N"><img src="https://img.shields.io/discord/295953187817521152.svg?logo=discord&style=flat-square&colorA=7289da&label=discord" alt="Chat"></a>
  <a href="https://twitter.com/invertaseio"><img src="https://img.shields.io/twitter/follow/invertaseio.svg?style=social&label=Follow" alt="Follow on Twitter"></a>
</p>

Extremely fast and lightweight [double-ended queue](http://en.wikipedia.org/wiki/Double-ended_queue) implementation with zero dependencies.

Double-ended queues can also be used as a:

- [Stack](http://en.wikipedia.org/wiki/Stack_\(abstract_data_type\))
- [Queue](http://en.wikipedia.org/wiki/Queue_\(data_structure\))

This implementation is currently the fastest available, even faster than `double-ended-queue`, see the [benchmarks](#benchmarks)

Every queue operation is done at a constant `O(1)` - including random access from `.peekAt(index)`.

**Works on all node versions >= v0.10**

# Quick Start

    npm install denque

```js
const Denque = require("denque");

const denque = new Denque([1,2,3,4]);
denque.shift(); // 1
denque.pop(); // 4
```


# API

- [`new Denque()`](#new-denque---denque)
- [`new Denque(Array items)`](#new-denquearray-items---denque)
- [`push(item)`](#pushitem---int)
- [`unshift(item)`](#unshiftitem---int)
- [`pop()`](#pop---dynamic)
- [`shift()`](#shift---dynamic)
- [`toArray()`](#toarray---array)
- [`peekBack()`](#peekback---dynamic)
- [`peekFront()`](#peekfront---dynamic)
- [`peekAt(int index)`](#peekAtint-index---dynamic)
- [`remove(int index, int count)`](#remove)
- [`removeOne(int index)`](#removeOne)
- [`splice(int index, int count, item1, item2, ...)`](#splice)
- [`isEmpty()`](#isempty---boolean)
- [`clear()`](#clear---void)

#### `new Denque()` -> `Denque`

Creates an empty double-ended queue with initial capacity of 4.

```js
var denque = new Denque();
denque.push(1);
denque.push(2);
denque.push(3);
denque.shift(); //1
denque.pop(); //3
```

<hr>

#### `new Denque(Array items)` -> `Denque`

Creates a double-ended queue from `items`.

```js
var denque = new Denque([1,2,3,4]);
denque.shift(); // 1
denque.pop(); // 4
```

<hr>


#### `push(item)` -> `int`

Push an item to the back of this queue. Returns the amount of items currently in the queue after the operation.

```js
var denque = new Denque();
denque.push(1);
denque.pop(); // 1
denque.push(2);
denque.push(3);
denque.shift(); // 2
denque.shift(); // 3
```

<hr>

#### `unshift(item)` -> `int`

Unshift an item to the front of this queue. Returns the amount of items currently in the queue after the operation.

```js
var denque = new Denque([2,3]);
denque.unshift(1);
denque.toString(); // "1,2,3"
denque.unshift(-2);
denque.toString(); // "-2,-1,0,1,2,3"
```

<hr>


#### `pop()` -> `dynamic`

Pop off the item at the back of this queue.

Note: The item will be removed from the queue. If you simply want to see what's at the back of the queue use [`peekBack()`](#peekback---dynamic) or [`.peekAt(-1)`](#peekAtint-index---dynamic).

If the queue is empty, `undefined` is returned. If you need to differentiate between `undefined` values in the queue and `pop()` return value -
check the queue `.length` before popping.

```js
var denque = new Denque([1,2,3]);
denque.pop(); // 3
denque.pop(); // 2
denque.pop(); // 1
denque.pop(); // undefined
```

**Aliases:** `removeBack`

<hr>

#### `shift()` -> `dynamic`

Shifts off the item at the front of this queue.

Note: The item will be removed from the queue. If you simply want to see what's at the front of the queue use [`peekFront()`](#peekfront---dynamic) or [`.peekAt(0)`](#peekAtint-index---dynamic).

If the queue is empty, `undefined` is returned. If you need to differentiate between `undefined` values in the queue and `shift()` return value -
check the queue `.length` before shifting.

```js
var denque = new Denque([1,2,3]);
denque.shift(); // 1
denque.shift(); // 2
denque.shift(); // 3
denque.shift(); // undefined
```

<hr>

#### `toArray()` -> `Array`

Returns the items in the queue as an array. Starting from the item in the front of the queue and ending to the item at the back of the queue.

```js
var denque = new Denque([1,2,3]);
denque.push(4);
denque.unshift(0);
denque.toArray(); // [0,1,2,3,4]
```

<hr>

#### `peekBack()` -> `dynamic`

Returns the item that is at the back of this queue without removing it.

If the queue is empty, `undefined` is returned.

```js
var denque = new Denque([1,2,3]);
denque.push(4);
denque.peekBack(); // 4
```

<hr>

#### `peekFront()` -> `dynamic`

Returns the item that is at the front of this queue without removing it.

If the queue is empty, `undefined` is returned.

```js
var denque = new Denque([1,2,3]);
denque.push(4);
denque.peekFront(); // 1
```

<hr>

#### `peekAt(int index)` -> `dynamic`

Returns the item that is at the given `index` of this queue without removing it.

The index is zero-based, so `.peekAt(0)` will return the item that is at the front, `.peekAt(1)` will return
the item that comes after and so on.

The index can be negative to read items at the back of the queue. `.peekAt(-1)` returns the item that is at the back of the queue,
`.peekAt(-2)` will return the item that comes before and so on.

Returns `undefined` if `index` is not a valid index into the queue.

```js
var denque = new Denque([1,2,3]);
denque.peekAt(0); //1
denque.peekAt(1); //2
denque.peekAt(2); //3

denque.peekAt(-1); // 3
denque.peekAt(-2); // 2
denque.peekAt(-3); // 1
```

**Note**: The implementation has O(1) random access using `.peekAt()`.

**Aliases:** `get`

<hr>

#### `remove(int index, int count)` -> `array`

Remove number of items from the specified index from the list.

Returns array of removed items.

Returns undefined if the list is empty.

```js
var denque = new Denque([1,2,3,4,5,6,7]);
denque.remove(0,3); //[1,2,3]
denque.remove(1,2); //[5,6]
var denque1 = new Denque([1,2,3,4,5,6,7]);
denque1.remove(4, 100); //[5,6,7]
```

<hr>

#### `removeOne(int index)` -> `dynamic`

Remove and return the item at the specified index from the list.

Returns undefined if the list is empty.

```js
var denque = new Denque([1,2,3,4,5,6,7]);
denque.removeOne(4); // 5
denque.removeOne(3); // 4
denque1.removeOne(1); // 2
```

<hr>

#### `splice(int index, int count, item1, item2, ...)` -> `array`

Native splice implementation.

Remove number of items from the specified index from the list and/or add new elements.

Returns array of removed items or empty array if count == 0.

Returns undefined if the list is empty.

```js
var denque = new Denque([1,2,3,4,5,6,7]);
denque.splice(denque.length, 0, 8, 9, 10); // []
denque.toArray() // [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
denque.splice(3, 3, 44, 55, 66); // [4,5,6]
denque.splice(5,4, 666,667,668,669); // [ 66, 7, 8, 9 ]
denque.toArray() // [ 1, 2, 3, 44, 55, 666, 667, 668, 669, 10 ]
```

<hr>

#### `isEmpty()` -> `boolean`

Return `true` if this queue is empty, `false` otherwise.

```js
var denque = new Denque();
denque.isEmpty(); // true
denque.push(1);
denque.isEmpty(); // false
```

<hr>

#### `clear()` -> `void`

Remove all items from this queue. Does not change the queue's capacity.

```js
var denque = new Denque([1,2,3]);
denque.toString(); // "1,2,3"
denque.clear();
denque.toString(); // ""
```
<hr>


## Benchmarks

#### Platform info:
```
Darwin 17.0.0 x64
Node.JS 9.4.0
V8 6.2.414.46-node.17
Intel(R) Core(TM) i7-7700K CPU @ 4.20GHz × 8
```

#### 1000 items in queue

 (3 x shift + 3 x push ops per 'op')

    denque x 64,365,425 ops/sec ±0.69% (92 runs sampled)
    double-ended-queue x 26,646,882 ops/sec ±0.47% (94 runs sampled)

#### 2 million items in queue

 (3 x shift + 3 x push ops per 'op')

    denque x 61,994,249 ops/sec ±0.26% (95 runs sampled)
    double-ended-queue x 26,363,500 ops/sec ±0.42% (91 runs sampled)

#### Splice

 (1 x splice per 'op') - initial size of 100,000 items

    denque.splice x 925,749 ops/sec ±22.29% (77 runs sampled)
    native array splice x 7,777 ops/sec ±8.35% (50 runs sampled)

#### Remove

 (1 x remove + 10 x push per 'op') - initial size of 100,000 items

    denque.remove x 2,635,275 ops/sec ±0.37% (95 runs sampled)
    native array splice - Fails to complete: "JavaScript heap out of memory"

#### Remove One

 (1 x removeOne + 10 x push per 'op') - initial size of 100,000 items

    denque.removeOne x 1,088,240 ops/sec ±0.21% (93 runs sampled)
    native array splice x 5,300 ops/sec ±0.41% (96 runs sampled)
    
---

Built and maintained with 💛 by [Invertase](https://invertase.io).

- [💼 Hire Us](https://invertase.io/hire-us)
- [☕️ Sponsor Us](https://opencollective.com/react-native-firebase)
- [👩‍💻 Work With Us](https://invertase.io/jobs)
