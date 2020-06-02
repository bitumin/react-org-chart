let _ = require('lodash')

let getName = (data, truncate=true, length=30) =>
  truncate
    ? _.truncate(_.get(data, 'entity.name'), {length})
    : _.get(data, 'entity.name')

let getTitle = (data, truncate=true, length=18) =>
  truncate
    ? _.truncate(_.get(data, 'entity.title'), {length})
    : _.get(data, 'entity.title')

let getSubTitle = (data, truncate=true, length=17) =>
  truncate
    ? _.truncate(_.get(data, 'entity.subTitle'), {length})
    : _.get(data, 'entity.subTitle')

let getCount = data => {
  let count = _.get(data, 'entity.totalReports')
  if (!count) { return '' }
  let pluralEnding = count > 1 ? 's' : ''
  return `${count} supervisee${pluralEnding}`
}

let getCursorForNode = data =>
  data.children || data._children || data.hasChild
    ? 'pointer'
    : 'default'

module.exports = {
  getName,
  getTitle,
  getSubTitle,
  getCount,
  getCursorForNode,
}