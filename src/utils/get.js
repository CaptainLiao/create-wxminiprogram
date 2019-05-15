function getIn (target, keyPath, notFoundValue = undefined) {
  let key
  for (let i = 0; i < keyPath.length; i++) {
    key = keyPath[i]
    if (target && target.hasOwnProperty(key)) {
      target = target[key]
    } else {
      return notFoundValue
    }
  }

  return target
}

function get (target, keyPathStr, notFoundValue = undefined) {
  return getIn(target, keyPathStr.split('.'), notFoundValue)
}

export default get
