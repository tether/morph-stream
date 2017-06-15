const Readable = require('readable-stream').Readable

/**

 * This is a simple description.
 *
 * @api public
 */

module.exports = function (value) {
  const stream = new Readable
  stream._read = () => {}
  stream.push(value)
  stream.push(null)
  return stream
  // do something
}
