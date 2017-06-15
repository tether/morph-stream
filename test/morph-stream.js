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
