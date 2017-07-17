/**
 * Dependencies.
 */

const Readable = require('readable-stream').Readable
const toString = Object.prototype.toString

/**
 * Transform any value into a readable stream.
 *
 * @param {String | Number | Boolean | Promises} value
 * @param {Boolean?} objectMode
 * @param {Stream?} readable
 * @return {Stream}
 * @api public
 */

module.exports = function (arg) {
  const result = new Readable
  result._read = () => {}
  switch(type(arg)) {
    case 'Promise':
      arg.then(value => {
        result.push(value)
        result.push(null)
      })
      break
    default:
      break
  }
  return result
}



function type (value) {
  const proto = toString.call(value)
  return proto.substring(8, proto.length - 1)
}
