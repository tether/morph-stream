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

module.exports = function morph (value) {
  const result = new Readable({
    objectMode: true
  })
  result._read = () => {}
  switch(type(value)) {
    case 'String':
      result.push(value)
      result.push(null)
      break
    case 'Promise':
      promise(result, value)
      break
    case 'Object':
      result.push(value)
      result.push(null)
      break
    default:
      break
  }
  return result
}

function promise (input, value) {
  value.then(val => {
    input.push(val)
    input.push(null)
  }, reason => input.emit('error', reason))
}



function type (value) {
  const proto = toString.call(value)
  return proto.substring(8, proto.length - 1)
}
