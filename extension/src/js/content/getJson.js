const getJson = () => {
  var orig

  if (document.body.childNodes[0].tagName === 'PRE') {
    return document.body.childNodes[0].innerText
  } else if (orig = document.getElementById('formatted')) {
    return orig.innerText
  } else {
    return false
  }
}

export default getJson
