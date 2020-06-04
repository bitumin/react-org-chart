import React from 'react'
import './App.css'
import _ from 'lodash'
import OrgChart from '@smartprocure/react-org-chart'
import { BrowserRouter, Route } from 'react-router-dom'
import { tree1, tree2 } from './Tree'
import avatarPersonnel from './assets/avatar-personnel.svg'

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      tree: null,
      downloadingChart: false,
      config: {},
      highlightPostNumbers: [1],
    }
  }

  handleDownload = () => {
    this.setState({ downloadingChart: false })
  }

  handleOnChangeConfig = config => {
    this.setState({ config: config })
  }

  handleLoadConfig = () => {
    const { config } = this.state
    return config
  }

  render() {
    const { tree, config, downloadingChart } = this.state

    //For downloading org chart as image or pdf based on id
    const downloadImageId = 'download-image'
    const downloadPdfId = 'download-pdf'

    return (
      <BrowserRouter basename="/react-org-chart">
        <Route exact path="/">
          <>
            <div style={{marginLeft: 50, marginTop: 2}}>
              <button onClick={() => this.setState({ tree: tree1 })} className="btn btn-outline-primary">Load Tree 1</button>
              <button onClick={() => this.setState({ tree: tree2 })} className="btn btn-outline-primary">Load Tree 2</button>
            </div>
            <div className="zoom-buttons">
              <button
                className="btn btn-outline-primary zoom-button"
                id="zoom-in"
              >
                +
              </button>
              <button
                className="btn btn-outline-primary zoom-button"
                id="zoom-out"
              >
                -
              </button>
            </div>
            <div className="download-buttons">
              <button className="btn btn-outline-primary" id="download-image">
                Download as image
              </button>
              <button className="btn btn-outline-primary" id="download-pdf">
                Download as PDF
              </button>
              <a
                className="github-link"
                href="https://github.com/unicef/react-org-chart"
              >
                Github
              </a>
              {downloadingChart && <div>Downloading chart</div>}
            </div>
            {this.state.tree &&
              <OrgChart
                tree={this.state.tree}
                downloadImageId={downloadImageId}
                downloadPdfId={downloadPdfId}
                onConfigChange={config => {
                  this.handleOnChangeConfig(config)
                }}
                loadConfig={d => {
                  let configuration = this.handleLoadConfig(d)
                  if (configuration) {
                    return configuration
                  }
                }}
                downlowdedOrgChart={d => {
                  this.handleDownload()
                }}
                loadImage={d => {
                  return Promise.resolve(avatarPersonnel)
                }}
                loadParent={d => {
                  const parentData = this.getParent(d)
                  return parentData
                }}
                loadChildren={d => {
                  const childrenData = this.getChild(d.id)
                  return childrenData
                }}
              />
            }
          </>
        </Route>
      </BrowserRouter>
    )
  }
}
