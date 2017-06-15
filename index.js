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

module.exports = function (value) {
  const type = typeof value
  const bool = type === 'object'
  const stream = new Readable({
    objectMode: bool
  })
  const write = reason => {
    stream.push(reason)
    stream.push(null)
  }
  stream._read = () => {}
  if (bool) {
    if (typeof value.then === 'function') value.then(write)
    else if (typeof value.pipe === 'function') return value
    else if (value instanceof Array) value.map(item => stream.push(item)) && stream.push(null)
    else write(value)
  } else write(value.toString())
  return stream
}
