function type(obj) {
  return Object.prototype.toString.call(obj)
}

const _String = obj => type(obj) === '[object String]'
const _Array = obj => type(obj) === '[object Array]'
const _Object = obj => type(obj) === '[object Object]'
const _Boolean = obj => type(obj) === '[object Boolean]'
const _Function = obj => type(obj) === '[object Function]'
const _nil = obj => obj === null || obj === undefined
const _valid = obj => !!obj

export default {
  String: _String,
  Array: _Array,
  Object: _Object,
  Boolean: _Boolean,
  Function: _Function,
  nil: _nil,
  valid: _valid
}