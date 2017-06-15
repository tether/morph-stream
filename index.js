const Readable = require('readable-stream').Readable

/**

 * This is a simple description.
 *
 * @api public
 */

module.exports = function (value) {
  const type = typeof value
  const bool = type === 'object'
  const stream = new Readable({
    objectMode: bool
  })
  stream._read = () => {}
  if (bool) {
    if (typeof value.then === 'function') {
      value.then(reason => {
        stream.push(reason)
        stream.push(null)
      })
    } else if (typeof value.pipe === 'function') {
      return value
    } else {
      stream.push(value)
      stream.push(null)
    }
  } else {
    stream.push(value.toString())
    stream.push(null)
  }
  return stream
}
