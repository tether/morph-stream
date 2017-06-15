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
