/**
 * Test dependencies.
 */

const test = require('tape')
const morph = require('..')
const concat = require('concat-stream')


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

test('morph object into stream', assert => {
  assert.plan(1)
  const data = {
    foo: 'bar'
  }
  morph(data).pipe(concat(chunks => {
    assert.deepEqual(chunks[0], data)
  }))
})

test('morph promise into stream', assert => {
  assert.plan(1)
  morph(new Promise((resolve, reject) => {
    setTimeout(() => resolve('hello world'), 500)
  })).pipe(concat(data => {
    assert.deepEqual(data, 'hello world')
  }))
})
