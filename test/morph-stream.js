/**
 * Test dependencies.
 */

const test = require('tape')
const morph = require('..')
const concat = require('concat-stream')
const Readable = require('readable-stream').Readable

test('morph string into stream', assert => {
  assert.plan(1)
  morph('hello').pipe(concat(data => {
    assert.equal(data.toString(), 'hello')
  }))
})

test('morph number into stream', assert => {
  assert.plan(1)
  morph(10).pipe(concat(data => {
    assert.equal(data.toString(), '10')
  }))
})

test('morph boolean into stream', assert => {
  assert.plan(1)
  morph(true).pipe(concat(data => {
    assert.equal(data.toString(), 'true')
  }))
})

test('morph promise into stream', assert => {
  assert.plan(1)
  morph(new Promise((resolve, reject) => {
    setTimeout(() => resolve('hello world'), 500)
  })).pipe(concat(data => {
    assert.deepEqual(data.toString(), 'hello world')
  }))
})

test('morph stream resolved by a promise', assert => {
  assert.plan(1)
  morph(new Promise(resolve => {
    resolve(stream())
  })).pipe(concat(data => {
    assert.equal(data.toString(), 'hello')
  }))
})


test('should pass error to stream when promise throw an error', assert => {
  assert.plan(1)
  morph(new Promise((resolve, reject) => {
    throw new Error('failed!')
  })).on('error', e => {
    assert.equal(e.message, 'failed!')
  })
})

test('should pass error to stream when promise is rejected', assert => {
  assert.plan(1)
  morph(new Promise((resolve, reject) => {
    reject('failed!')
  })).on('error', e => {
    assert.equal(e, 'failed!')
  })
})

// test('should end strean when promise is rejected', assert => {
//   assert.plan(1)
//   morph(new Promise((resolve, reject) => {
//     reject('failed!')
//   })).on('end', () => assert.ok('stream ended'))
// })

test('morph stream', assert => {
  assert.plan(1)
  const input = stream()
  morph(input)
   .pipe(concat(data => {
     assert.equal(data.toString(), 'hello')
   }))
})

test('morph array into stream', assert => {
  assert.plan(1)
  const arr = ['hello', 'world', 'foo', 'bar']
  morph(arr)
    .on('data', () => arr.pop())
    .on('end', () => {
      assert.equal(arr.length, 0)
    })
})

test('should pass readable stream', assert => {
  assert.plan(1)
  const read = new Readable
  read._read = () => {}
  morph('hello', false, read)
  read.pipe(concat(data => {
    assert.equal(data.toString(), 'hello')
  }))
})


test('morph object into stream', assert => {
  assert.plan(1)
  const data = {
    foo: 'bar'
  }
  morph(data).pipe(concat(chunks => {
    assert.equal(chunks.toString(), JSON.stringify(data))
  }))
})

/**
 * Create stream.
 *
 * @return {ReadableStream}
 * @api private
 */

function stream () {
  const read = new Readable
  read._read = () => {}
  setTimeout(() => {
    read.push('hello')
    read.push(null)
  }, 50)
  return read
}
