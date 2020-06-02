const _ = require('lodash')
const d3 = require('d3')
const { wrapText, helpers, covertImageToBase64 } = require('../utils')
const renderLines = require('./renderLines')
const exportOrgChartImage = require('./exportOrgChartImage')
const exportOrgChartPdf = require('./exportOrgChartPdf')
const onClick = require('./onClick')
const iconLink = require('./components/iconLink')
const supervisorIcon = require('./components/supervisorIcon')

const CHART_NODE_CLASS = 'org-chart-node'
const ENTITY_LINK_CLASS = 'org-chart-entity-link'
const ENTITY_NAME_CLASS = 'org-chart-entity-name'
const ENTITY_TITLE_CLASS = 'org-chart-entity-title'
const ENTITY_SUB_TITLE_CLASS = 'org-chart-entity-sub-title'
const ENTITY_HIGHLIGHT = 'org-chart-entity-highlight'
const COUNTS_CLASS = 'org-chart-counts'

function render(config) {
  const {
    svgroot,
    svg,
    tree,
    animationDuration,
    nodeWidth,
    nodeHeight,
    nodePaddingX,
    nodePaddingY,
    nodeBorderRadius,
    backgroundColor,
    nameColor,
    titleColor,
    reportsColor,
    borderColor,
    avatarWidth,
    lineDepthY,
    treeData,
    sourceNode,
    onEntityLinkClick,
    loadImage,
    downloadImageId,
    downloadPdfId,
    elemWidth,
    margin,
    onConfigChange,
    nameFontSize = 14,
    nameTruncateLength = 30,
    titleFontSize = 13,
    titleTruncateLength = 18,
    subTitleFontSize = 14,
    subTitleTruncateLength = 17,
    countFontSize = 14,
    getName,
    getTitle,
    getSubTitle,
    getCount,
    onNameClick,
    onTitleClick,
    onSubTitleClick,
    onCountClick
  } = config

  // Compute the new tree layout.
  const nodes = tree.nodes(treeData).reverse()
  const links = tree.links(nodes)

  config.links = links
  config.nodes = nodes

  // Normalize for fixed-depth.
  nodes.forEach(function(d) {
    d.y = d.depth * lineDepthY
  })

  // Update the nodes
  const node = svg.selectAll('g.' + CHART_NODE_CLASS).data(
    nodes.filter(d => d.id),
    d => d.id
  )

  const parentNode = sourceNode || treeData

  svg.selectAll('#supervisorIcon').remove()

  supervisorIcon({
    svg: svg,
    config,
    treeData,
    x: 70,
    y: -24,
  })

  // Enter any new nodes at the parent's previous position.
  const nodeEnter = node
    .enter()
    .insert('g')
    .attr('class', CHART_NODE_CLASS)
    .attr('transform', `translate(${parentNode.x0}, ${parentNode.y0})`)
    .on('click', onClick(config))

  // Entity Card Shadow
  nodeEnter
    .append('rect')
    .attr('width', nodeWidth)
    .attr('height', nodeHeight)
    .attr('fill', backgroundColor)
    .attr('stroke', borderColor)
    .attr('rx', nodeBorderRadius)
    .attr('ry', nodeBorderRadius)
    .attr('fill-opacity', 0.05)
    .attr('stroke-opacity', 0.025)
    .attr('filter', 'url(#boxShadow)')

  // Entity Card Container
  nodeEnter
    .append('rect')
    .attr('class', d => (d.isHighlight ? `${ENTITY_HIGHLIGHT} box` : 'box'))
    .attr('width', nodeWidth)
    .attr('height', nodeHeight)
    .attr('id', d => d.id)
    .attr('fill', backgroundColor)
    .attr('stroke', borderColor)
    .attr('rx', nodeBorderRadius)
    .attr('ry', nodeBorderRadius)
    .style('cursor', helpers.getCursorForNode)

  const namePos = {
    x: nodeWidth / 2,
    y: nodePaddingY * 1.8 + avatarWidth,
  }

  const avatarPos = {
    x: nodeWidth / 2 - avatarWidth / 2,
    y: nodePaddingY / 2,
  }

  // Entity's Name
  nodeEnter
    .append('text')
    .attr('class', ENTITY_NAME_CLASS + ' unedited')
    .attr('x', namePos.x)
    .attr('y', namePos.y)
    .attr('dy', '.3em')
    .style('cursor', 'pointer')
    .style('fill', nameColor)
    .style('font-size', nameFontSize)
    .text(d => getName
      ? getName(d, true, nameTruncateLength)
      : helpers.getName(d, true, nameTruncateLength))
    .on('click', data => {
      if (onNameClick) {
        d3.event.stopPropagation()
        onNameClick(data, d3.event)
      }
    })

  // Title
  nodeEnter
    .append('text')
    .attr('class', ENTITY_TITLE_CLASS + ' unedited')
    .attr('x', nodeWidth / 2)
    .attr('y', namePos.y + nodePaddingY * 2.4)
    .attr('dy', '0.1em')
    .style('font-size', titleFontSize)
    .style('cursor', 'pointer')
    .style('fill', titleColor)
    .text(d => getTitle
      ? getTitle(d, true, titleTruncateLength)
      : helpers.getTitle(d, true, titleTruncateLength))
    .on('click', data => {
      if (onTitleClick) {
        d3.event.stopPropagation()
        onTitleClick(data, d3.event)
      }
    })

  // SubTitle
  nodeEnter
  .append('text')
  .attr('class', ENTITY_SUB_TITLE_CLASS + ' unedited')
  .attr('x', nodeWidth / 2)
  .attr('y', namePos.y + nodePaddingY * 3.9)
  .attr('dy', '0.1em')
  .style('font-size', subTitleFontSize)
  .style('cursor', 'pointer')
  .style('fill', titleColor)
  .text(d => getSubTitle
    ? getSubTitle(d, true, subTitleTruncateLength)
    : helpers.getSubTitle(d, true, subTitleTruncateLength))
  .on('click', data => {
    if (onSubTitleClick) {
      d3.event.stopPropagation()
      onSubTitleClick(data, d3.event)
    }
  })

  const heightForTitle = 60 // getHeightForText(d.entity.title)

  // Count
  nodeEnter
    .append('text')
    .attr('class', COUNTS_CLASS + ' unedited')
    .attr('x', nodeWidth / 2)
    .attr('y', namePos.y + nodePaddingY + heightForTitle)
    .attr('dy', '.9em')
    .style('font-size', countFontSize)
    .style('font-weight', 400)
    .style('cursor', 'pointer')
    .style('fill', reportsColor)
    .text(d => getCount ? getCount(d, true) : helpers.getCount(d, true))
    .on('click', data => {
      if (onCountClick) {
        d3.event.stopPropagation()
        onCountClick(data, d3.event)
      }
    })

  // Entity's Avatar
  nodeEnter
    .append('image')
    .attr('id', d => `image-${d.id}`)
    .attr('width', avatarWidth)
    .attr('height', avatarWidth)
    .attr('x', avatarPos.x)
    .attr('y', avatarPos.y)
    .attr('stroke', borderColor)
    .attr('s', d => {
      d.entity.hasImage
        ? d.entity.avatar
        : loadImage(d).then(res => {
            covertImageToBase64(res, function(dataUrl) {
              d3.select(`#image-${d.id}`).attr('href', dataUrl)
              d.entity.avatar = dataUrl
            })
            d.entity.hasImage = true
            return d.entity.avatar
          })
    })
    .attr('src', d => d.entity.avatar)
    .attr('href', d => d.entity.avatar)
    .attr('clip-path', 'url(#avatarClip)')

  // Entity's Link
  const nodeLink = nodeEnter
    .append('a')
    .attr('class', ENTITY_LINK_CLASS)
    .attr('display', d => (d.entity.link ? '' : 'none'))
    .attr('xlink:href', d => d.entity.link)
    .on('click', data => {
      d3.event.stopPropagation()
      if (onEntityLinkClick) {
        onEntityLinkClick(data, d3.event)
      }
    })

  iconLink({
    svg: nodeLink,
    x: nodeWidth - 20,
    y: 8,
  })

  // Transition nodes to their new position.
  const nodeUpdate = node
    .transition()
    .duration(animationDuration)
    .attr('transform', d => `translate(${d.x},${d.y})`)

  nodeUpdate
    .select('rect.box')
    .attr('fill', backgroundColor)
    .attr('stroke', borderColor)

  // Transition exiting nodes to the parent's new position.
  const nodeExit = node
    .exit()
    .transition()
    .duration(animationDuration)
    .attr('transform', d => `translate(${parentNode.x},${parentNode.y})`)
    .remove()

  // Update the links
  const link = svg.selectAll('path.link').data(links, d => d.target.id)

  // Wrap the texts
  const wrapWidth = 124
  _.each(
    [ENTITY_NAME_CLASS, ENTITY_TITLE_CLASS, ENTITY_SUB_TITLE_CLASS, COUNTS_CLASS],
    cssClass => {
      svg.selectAll(`text.unedited.${cssClass}`).call(wrapText, wrapWidth)
    }
  )

  // Add Tooltips
  svg.selectAll(`text.${ENTITY_NAME_CLASS}`).append('svg:title').text(d => getName ? getName(d, false) : helpers.getName(d, false))
  svg.selectAll(`text.${ENTITY_TITLE_CLASS}`).append('svg:title').text(d => getTitle ? getTitle(d, false) : helpers.getTitle(d, false))
  svg.selectAll(`text.${ENTITY_SUB_TITLE_CLASS}`).append('svg:title').text(d => getSubTitle ? getSubTitle(d, false) : helpers.getSubTitle(d, false))
  svg.selectAll(`text.${COUNTS_CLASS}`).append('svg:title').text(d => getCount ? getCount(d, false) : helpers.getCount(d, false))

  // Render lines connecting nodes
  renderLines(config)

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x
    d.y0 = d.y
  })

  var nodeLeftX = -70
  var nodeRightX = 70
  var nodeY = 200
  nodes.map(d => {
    nodeLeftX = d.x < nodeLeftX ? d.x : nodeLeftX
    nodeRightX = d.x > nodeRightX ? d.x : nodeRightX
    nodeY = d.y > nodeY ? d.y : nodeY
  })

  config.nodeRightX = nodeRightX
  config.nodeY = nodeY
  config.nodeLeftX = nodeLeftX * -1

  d3.select(downloadImageId).on('click', function() {
    exportOrgChartImage(config)
  })

  d3.select(downloadPdfId).on('click', function() {
    exportOrgChartPdf(config)
  })
  onConfigChange(config)
}
module.exports = render
