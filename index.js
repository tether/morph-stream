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
      object(result, value)
      break
    case 'Array':
      value.map(item => {
        result.push(item)
      })
      result.push(null)
      break
    default:
      break
  }
  return result
}

function object (input, value) {
  if (typeof value.on === 'function' && typeof value.pipe === 'function') {
    value.on('data', data => input.push(data))
    value.on('error', err => input.emit('error', err))
    value.on('end', () => input.push(null))
  } else {
    input.push(value)
    input.push(null)
  }
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
