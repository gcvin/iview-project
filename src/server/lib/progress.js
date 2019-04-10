const slog = require('single-line-log').stdout

function Progress (description = 'Progress', length = 25, total = 1) {
  this.description = description
  this.length = length
  this.total = total
  this.complete = 0

  this.render = function (complete) {
    this.complete = complete

    const percent = (complete / this.total).toFixed(4)
    const fillLen = Math.floor(percent * this.length)
    const emptyLen = this.length - fillLen
    const fill = new Array(fillLen).fill('█').join('')
    const empty = new Array(emptyLen).fill('░').join('')
    const text = `${this.description}: ${(100 * percent).toFixed(2)}% ${fill}${empty} ${complete}/${this.total}`

    slog(text)
  }

  this.update = function () {
    this.render(this.complete + 1)
  }
}

module.exports = Progress
