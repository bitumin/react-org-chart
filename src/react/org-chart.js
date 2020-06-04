let _ = require('lodash')
const { createElement, PureComponent } = require('react')
const { initComponent } = require('../chart')

class OrgChart extends PureComponent {
  render() {
    const { id } = this.props

    return createElement('div', { id })
  }

  static defaultProps = {
    id: 'react-org-chart',
    downloadImageId: 'download-image',
    downloadPdfId: 'download-pdf',
    zoomInId: 'zoom-in',
    zoomOutId: 'zoom-out',
    zoomExtentId: 'zoom-extent',
    tree: {}
  }
  componentDidUpdate(prevProps) {
    if (_.get(prevProps, 'tree.id') !== _.get(this, 'props.tree.id')) {
      initComponent(this.props)
    }
  }
  componentDidMount() {
    initComponent(this.props)
  }
}

module.exports = OrgChart
