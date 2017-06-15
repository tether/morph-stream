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

test('should not morph a stream and return it', assert => {
  assert.plan(1)
  const input = stream()
  const output = morph(input)
  assert.equal(input, output)
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
