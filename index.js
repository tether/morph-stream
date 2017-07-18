/**
 * Dependencies.
 */

const Readable = require('readable-stream').Readable
const toString = Object.prototype.toString

/**
 * Objects supported for morphing.
 */

const map = {
  'Promise' : promise,
  'Object': object,
  'Array': array,
  'Error': error,
  'Function': callback
}


/**
 * Expose 'morph'
 */

module.exports = morph


/**
 * Transform any value into a readable stream.
 *
 * @param {String | Number | Boolean | Promises} value
 * @param {Boolean?} objectMode
 * @param {Stream?} readable
 * @return {Stream}
 * @api public
 */

function morph (value, input) {
  const result = input || readable()
  const cb = map[type(value)] || write
  cb(result, value)
  return result
}

function readable () {
  const input = new Readable({
    objectMode: true
  })
  input._read = () => {}
  //@note we should debug errors
  return input
}


function type (value) {
  const proto = toString.call(value)
  return proto.substring(8, proto.length - 1)
}


function write (input, value) {
  input.push(value)
  input.push(null)
}


function array (input, value) {
  value.map(item => input.push(item))
  input.push(null)
}

function object (input, value) {
  if (typeof value.on === 'function' && typeof value.pipe === 'function') {
    stream(input, value)
  } else {
    input.push(value)
    input.push(null)
  }
}

function stream (input, value) {
  value.on('data', data => input.push(data))
  value.on('error', err => input.emit('error', err))
  value.on('end', () => input.push(null))
}

function promise (input, value) {
  value.then(val => {
    morph(val, input)
  }, reason => input.emit('error', reason))
}


function error (input, value) {
  // make error asynchronous
  Promise.resolve().then(() => input.emit('error', value))
}

function callback (input, value) {
  morph(value(), input)
}
