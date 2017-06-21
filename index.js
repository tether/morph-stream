/**
 * Dependencies.
 */

const Readable = require('readable-stream').Readable

/**
 * Transform any value into a readable stream.
 *
 * @param {String | Number | Boolean | Promises} value
 * @param {Boolean?} objectMode
 * @param {Stream?} readable
 * @return {Stream}
 * @api public
 */

module.exports = function (value, objectMode, readable) {
  const result = stream(readable, objectMode)
  const write = reason => {
    result.push(reason)
    result.push(null)
  }
  if (typeof value === 'object') {
    if (typeof value.then === 'function') value.then(write)
    else if (typeof value.pipe === 'function') {
      value.on('data', buf => result.push(buf))
      value.on('end', () => result.push(null))
    } else if (value instanceof Array) value.map(item => result.push(item)) && result.push(null)
    else write(objectMode ? value : JSON.stringify(value))
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
