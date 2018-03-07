/**
 * Test dependencies.
 */

const test = require('tape')
const morph = require('..')
const concat = require('concat-stream')
const fs = require('fs')


test('morph string', assert => {
  assert.plan(1)
  morph('hello world').pipe(concat(data => assert.equal(data.toString(), 'hello world')))
})

test('morph other primitives', assert => {
  assert.plan(3)
  morph(10).pipe(concat(data => assert.equal(data.toString(), '10')))
  morph(true).pipe(concat(data => assert.equal(data.toString(), 'true')))
  morph(false).pipe(concat(data => assert.equal(data.toString(), 'false')))
})

test('morph object', assert => {
  assert.plan(1)
  morph({
    foo: 'bar'
  }).pipe(concat(data => assert.deepEqual(JSON.parse(data), {
    foo: 'bar'
  })))
})

test('morph array', assert => {
  assert.plan(1)
  morph(['hello', 'world']).pipe(concat(data => assert.deepEqual(JSON.parse(data), ['hello', 'world'])))
})

test('morph function', assert => {
  assert.plan(1)
  morph(() => 'hello world').pipe(concat(data => assert.equal(data.toString(), 'hello world')))
})

test('morph function that return primitive', assert => {
  assert.plan(1)
  morph(() => 2).pipe(concat(data => assert.equal(data.toString(), '2')))
})

test('morph resolved promise', assert => {
  assert.plan(1)
  const promise = new Promise(resolve => resolve('hello'))
  morph(promise).pipe(concat(data => {
    assert.equal(data.toString(), 'hello')
  }))
})

test('morph rejected promise', assert => {
  assert.plan(1)
  const promise = new Promise((resolve, reject) => reject('hello'))
  morph(promise).on('error', err => assert.equal(err, 'hello'))
})


test('morph input stream into output stream', assert => {
  assert.plan(1)
  morph(fs.createReadStream(__dirname + '/morph.txt'))
    .pipe(concat(data => assert.equal(data.toString(), 'hello world!\n')))
})


test('morph stream resolved by promise', assert => {
  assert.plan(1)
  const promise = new Promise((resolve, reject) => {
    resolve(fs.createReadStream(__dirname + '/morph.txt'))
  })
  morph(promise).pipe(concat(data => assert.equal(data.toString(), 'hello world!\n')))
})

test('should emit error when morphing error', assert => {
  assert.plan(1)
  morph(new Error('this is an error')).on('error', err => {
    assert.equal(err.message, 'this is an error')
  })
})

test('should morph error returned by promise', assert => {
  assert.plan(1)
  const promise = Promise.resolve().then(() => {
    return new Error('this is an error')
  })
  morph(promise).on('error', err => {
    assert.equal(err.message, 'this is an error')
  })
})

test('should end stream if value == null', assert => {
  assert.plan(1)
  morph(null).pipe(concat(data => {
    assert.equal(data.length, 0)
  }))
})

test('should morph a promise resolving to a primitive', assert => {
  assert.plan(1)
  morph(Promise.resolve(true).then(value => {
    return value
  })).pipe(concat(data => {
    assert.equal(data.toString(), 'true')
  }))
})
