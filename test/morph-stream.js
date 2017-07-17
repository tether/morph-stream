/**
 * Test dependencies.
 */

const test = require('tape')
const morph = require('..')
const concat = require('concat-stream')

test('morph promise into stream', assert => {
  assert.plan(1)
  const promise = new Promise(resolve => resolve('hello'))
  morph(promise).pipe(concat(data => {
    assert.equal(data.toString(), 'hello')
  }))
})
