export default {
  title (title) {
    title = title ? title + ' - Home' : 'iView project'
    window.document.title = title
  },
  getQueryString (name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    let r = window.location.search.substr(1).match(reg)
    if (r != null) {
      return unescape(r[2])
    }
    return null
  }
}
