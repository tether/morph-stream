/**
 * Test dependencies.
 */

const test = require('tape')
const morph = require('..')
const concat = require('concat-stream')


test('morph string into stream', assert => {
  assert.plan(1)
  morph('hello world').pipe(concat(data => assert.equal(data.toString(), 'hello world')))
})

test('morph object into stream', assert => {
  assert.plan(1)
  morph({
    foo: 'bar'
  }).pipe(concat(data => assert.deepEqual(data[0], {
    foo: 'bar'
  })))
})

test('morph array into stream', assert => {
  assert.plan(1)
  morph(['hello', 'world']).pipe(concat(data => assert.equal(data, 'helloworld')))
})

test('morph resolved promise into stream', assert => {
  assert.plan(1)
  const promise = new Promise(resolve => resolve('hello'))
  morph(promise).pipe(concat(data => {
    assert.equal(data.toString(), 'hello')
  }))
})

test('morph rejected promise into stream', assert => {
  assert.plan(1)
  const promise = new Promise((resolve, reject) => reject('hello'))
  morph(promise).on('error', err => assert.equal(err, 'hello'))
})

// promise resolve to stream, stirng, etc
