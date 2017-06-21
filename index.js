/**
 * Dependencies.
 */

const Readable = require('readable-stream').Readable

/**
 * Transform any value into a readable stream.
 *
 * @param {String | Number | Boolean | Promises} value
 * @return {Stream}
 * @api public
 */

module.exports = function (value, readable) {
  const bool =  typeof value === 'object'
  const result = stream(readable, bool)
  const write = reason => {
    result.push(reason)
    result.push(null)
  }
  if (bool) {
    if (typeof value.then === 'function') value.then(write)
    else if (typeof value.pipe === 'function') return value
    else if (value instanceof Array) value.map(item => result.push(item)) && result.push(null)
    else write(value)
  } else write(value.toString())
  return result
}


/**
 * Stream factory.
 *
 * @param {Stream?} obj
 * @param {Boolean?} objectMode
 * @return {Stream}
 * @api private
 */

function stream (obj, objectMode) {
  if (obj) return obj
  const result = new Readable({
    objectMode: objectMode
  })
  result._read = () => {}
  return result
}
