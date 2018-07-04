import en from './en'
import zh from './zh'

const msgs = {en, zh}

// string format
function format (txt) {
  var args = [].slice.call(arguments, 1)
  return txt.replace(/{(\d+)}/g, function (m, i) {
    return args[i]
  })
}

function capitalize (str) {
  return str.replace(/\b\w/g, function (c) { return c.toUpperCase() })
}

export const lang = function () {
  var lang = localStorage.getItem('lang') || navigator.language
  localStorage.setItem('lang', lang)
  return lang.substr(0, 2)
}()

export default function (code, args) {
  var txt = msgs[lang][code]
  if (txt) {
    return args ? format(txt, args) : txt
  } else {
    var split = code.split('.')

    console.log(split)
    return split.map(capitalize)
  }
}

