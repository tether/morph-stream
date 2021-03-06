/**
 * Dependencies.
 */

const {
  Readable,
  Stream
} = require('stream')
const pump = require('pump')
const toString = Object.prototype.toString


/**
 * Objects supported for morphing.
 */

const map = {
  'Promise' : promise,
  'Object': object,
  'Array': stringify,
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
  const cb = map[type(value)] || end
  cb(result, value)
  return new Proxy(result, {
    get(target, key, receiver) {
      if (key !== 'pipe') return target[key]
      return function (dest) {
        pump(result, dest)
        return dest
      }
    }
  })
}

/**
 * Create readable stream.
 *
 * @api private
 */

function readable () {
  const input = new Readable({
    objectMode: true
  })
  input._read = () => {}
  return input
}


/**
 * Parse value type.
 *
 * @param {Any} value
 * @return {String}
 * @api private
 */

function type (value) {
  const proto = toString.call(value)
  return proto.substring(8, proto.length - 1)
}


/**
 * End input stream with given value.
 *
 * @param {Stream} input
 * @param {Any} value
 * @api private
 */

function end (input, value) {
  if (value != null) input.push(String(value))
  input.push(null)
}


/**
 * End input stream with given object.
 *
 * @param {Stream} input
 * @param {Object} value
 * @api private
 */

function object (input, value) {
  if (value instanceof Stream) stream(input, value)
  else stringify(input, value)
}


/**
 * Stringify object and push down the pipe.
 *
 * @param {Stream} input
 * @param {Object} value
 * @api private
 */

function stringify (input, value) {
  input.push(JSON.stringify(value))
  input.push(null)
}

/**
 * End input stream with given stream.
 *
 * @param {Stream} input
 * @param {Stream} value
 * @api private
 */

function stream (input, value) {
  value.on('data', data => input.push(data))
  value.on('error', err => error(input, err))
  value.on('end', () => input.push(null))
}


/**
 * End input stream with given promise.
 *
 * @param {Stream} input
 * @param {Promise} value
 * @api private
 */

function promise (input, value) {
  value.then(val => {
    morph(val, input)
  }, reason => {
    input.emit('error', reason)
  })
}

/**
 * End input stream with given error.
 *
 * @param {Stream} input
 * @param {Error} value
 * @api private
 */

function error (input, value) {
  //@note we should debug errors
  // make error asynchronous
  input.destroy(value)
}


/**
 * End input stream with given function.
 *
 * @param {Stream} input
 * @param {Function} value
 * @api private
 */

function callback (input, value) {
  morph(value(), input)
}
