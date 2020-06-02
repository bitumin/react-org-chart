# React Organizational Chart
[![npm version](https://badge.fury.io/js/%40unicef%2Freact-org-chart.svg)](https://badge.fury.io/js/%40unicef%2Freact-org-chart)

React component for displaying organizational charts.

This component is based on [unicef/react-org-chart](https://github.com/unicef/react-org-chart).

# Features

From the previous package:

- High-performance D3-based SVG rendering
- Lazy-load children with a custom function
- Handle up to 1 million collapsed nodes and 5,000 expanded nodes
- Pan (drag and drop)
- Zoom in zoom out (with mouse wheel/scroll)
- Lazy-load of parents (go up in the tree)
- Zoom in, zoom out and zoom buttons.
- Download org chart as image or PDF

What we added:

- Changed component to be `React.Component` vs `React.PureComponent`
- Renamed `person` to `entity` throughout the codebase
- Removed `department`
- Added `subTitle` text element under the `title`.
- Added config props functions to get all the text values (`getName`, `getTitle`, `getSubTitle`, `getCount`)
- Added config props for all text values on click events (`onNameClick`, `onTitleClick`, `onSubTitleClick`, `onCountClick`)
- Added config props for the font sizes (`nameFontSize`, `titleFontSize`, `subTitleFontSize`, `countFontSize`)
- Added config props for the text truncation (`nameTruncateLength`, `titleTruncateLength`, `subTitleTruncateLength`)
- Added tooltips to all text values since we now support truncation

### React Props

| **Property**      | **Type**   | **Required** | **Description**                                            | **Default / Example**                                                        |
| ----------------- | ---------- | -------------|----------------------------------------------------------- | ------------------------------------------------------------------ |
| tree              | `Object`   | Required | Nested data model with some of all the employees in the company | See sample below |
| onConfigChange    | `Function` | Required | To set the latest config to state on change                    | See usage below                                         |
| loadConfig        | `Function` | Required | Pass latest config from state to OrgChart                      | See usage below                                      |
| getName           | `Function` | Optional | Function to get custom formatting / values for the name. Called with (`data`, `truncate`, `truncateLength`) arguments | See usage below |
| getTitle          | `Function` | Optional | Function to get custom formatting / values for the title. Called with (`data`, `truncate`, `truncateLength`) arguments | See usage below |
| getSubTitle       | `Function` | Optional | Function to get custom formatting / values for the sub title. Called with (`data`, `truncate`, `truncateLength`) arguments | See usage below |
| getCount          | `Function` | Optional | Function to get custom formatting / values for the count. Called with (`data`, `truncate`, `truncateLength`) arguments | See usage below |
| onNameClick       | `Function` | Optional | Function to call on click of the name. Called with (`data`) arguments | See usage below |
| onTitleClick      | `Function` | Optional | Function to call on click of the title. Called with (`data`) arguments | See usage below |
| onSubTitleClick   | `Function` | Optional | Function to call on click of the sub title. Called with (`data`) arguments | See usage below |
| onCountClick      | `Function` | Optional | Function to call on click of the count. Called with (`data`) arguments | See usage below |
| nameFontSize      | `Number`   | Optional | The font size of the name text element                         | 14                                                                |
| titleFontSize     | `Number`   | Optional | The font size of the title text element                        | 13                                                                |
| subTitleFontSize  | `Number`   | Optional | The font size of the title text element                        | 14                                                                |
| countFontSize     | `Number`   | Optional | The font size of the count text element                        | 14                                                                |
| nameTruncateLength | `Number`   | Optional | The number of characters before we truncate the name. Name spans 2 lines.           | 30                                           |
| titleTruncateLength | `Number`   | Optional | The number of characters before we truncate the title. Title is one line only.     | 18                                           |
| subTitleTruncateLength | `Number`   | Optional | The number of characters before we truncate the sub title. Title is one line only.     | 17                                           |
| nodeWidth         | `Number`   | Optional | Width of the component for each individual                     | 180                                                                |
| nodeHeight        | `Number`   | Optional | Height of the component for each individual                    | 100                                                                |
| nodeSpacing       | `Number`   | Optional | Spacing between each of the nodes in the chart                 | 12                                                                 |
| animationDuration | `Number`   | Optional | Duration of the animations in milliseconds                     | 350                                                                |
| lineType          | `String`   | Optional | Type of line that connects the nodes to each other             | “angle” “curve”                                                    |
| downloadImageId   | `String`   | Optional | Id of the DOM element that, on click, will trigger the download of the org chart as PNG. OrgChart will bind the click event to the DOM element with this ID | "download-image" (default)                                         |
| downloadPdfId     | `String`   | Optional | Id of the DOM element that, on click, will trigger the download of the org chart as PDF. OrgChart will bind the click event to the DOM element with this ID        | "download-pdf" (default)                                           |
| zoomInId          | `String`   | Optional | Id of the DOM element that, on click, will trigger a zoom of the org chart. OrgChart will bind the click event to the DOM element with this ID                                      | "zoom-in" (default)                                                |
| zoomOutId         | `String`   | Optional | Id of the DOM element that, on click, will trigger the zoom out of the org chart. OrgChart will bind the click event to the DOM element with this ID                                   | "zoom-out" (default)                                               |
| zoomExtentId      | `String`   | Optional |Id of the DOM element that, on click, will display whole org chart svg fit to screen. OrgChart will bind the click event to the DOM element with this ID(Optional)                              | "zoom-extent" (default)                                            |
| loadParent(personData)        | `Function` | Optional | Load parent with one level of children                         | See usage below                                                  |
| loadChildren (personData)      | `Function` | Optional | Load the children of particular node                           | See usage below                                                  |
| loadImage(personData)         | `Function` | Optional | To get image of person on API call                            | See usage below                                                  |


### Sample tree data

```jsx

{
  id: 1,
  entity: {
    id: 1,
    avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/spbroma/128.jpg',
    name: 'Jane Doe',
    title: 'IT',
    subTitle: 'CEO',
    totalReports: 5
  },
  hasChild: true,
  hasParent: false,
  isHighlight: true,
  children: [
    {
    id: 2,
    entity: {
      id: 2,
      avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/spbroma/128.jpg',
      name: 'John Foo',
      title: 'CTO',
      totalReports: 0
    },
    hasChild: false,
    hasParent: true,
    isHighlight: false,
    children: []
  },
  ...
  ]
}

```

### Usage

You have a complete working example in the **[examples/](https://github.com/smartprocure/react-org-chart/tree/master/examples)** folder

```jsx
import React from 'react'
import OrgChart from '@unicef/react-org-chart'

handleLoadConfig = () => {
   const { config } = this.state
   return config
}

render(){
  return (
    <OrgChart
      tree={tree}
      downloadImageId="download-image"
      downloadPdfId="download-pdf"
      onConfigChange={config => {
        // Setting latest config to state
        this.setState({ config: config })
      }}
      loadConfig={d => {
         // Called from d3 to get latest version of the config.
        const config = this.handleLoadConfig(d)
        return config
      }}
      loadParent={personData => {
        // getParentData(): To get the parent data from API
        const loadedParent = this.getParentData(personData)
        return Promise.resolve(loadedParent)
      }}
      loadChildren={personData => {
        // getChildrenData(): To get the children data from API
        const loadedChildren = this.getChildrenData(personData)
        return Promise.resolve(loadedChildren)
      }}
      loadImage={personData => {
        // getImage(): To get the image from API
        const image = getImage(personData.email)
        return Promise.resolve(image)
      }}
      // getTitle / getSubTitle / getCount work the same way & with the same args
      getName={(data, truncate, truncateLength) => `The great ${data.person.name}${truncate}`}
      // onTitleClick / onSubTitleClick / onCountClick work the same way  & with the same arg
      onNameClick={data => console.log(data.person.name)}
    />
  )
}
```


# Development

```bash
git clone https://github.com/unicef/react-org-chart.git
cd react-org-chart
npm install
```

To build in watch mode:

```bash
npm start
```

To build for production

```bash
npm run build
```

Running the example:

```bash
cd example/
npm install # Only first time
npm start
```

To deploy the example to gh-pages site

```bash
npm run deploy
```

## Collaborations and support

Just fork the project and make a pull request.

# License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
