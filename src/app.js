import React from 'react';
import { renderToString } from 'react-dom/server';
import D3ReactForce from '../lib/index';
import data from './mock/data1.json';
const { nodes, links } = data;
const { Simulation } = D3ReactForce;
let index = 1;
const img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3NpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo3NGZhYmFkYi1hZmViLTRkMjQtOTNjNy1jZWZhM2ZhOTVjZTciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDg2QjJCMTYxM0ZCMTFFNjg1MTI4QjAyNzhEQzUzMkEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDg2QjJCMTUxM0ZCMTFFNjg1MTI4QjAyNzhEQzUzMkEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6YjM2M2FkOWItNDg4Mi00N2FhLTk5ZjUtYWI4ODk4MjFiOGJkIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjc0ZmFiYWRiLWFmZWItNGQyNC05M2M3LWNlZmEzZmE5NWNlNyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pi/GS1QAAAD/UExURfn5+WZmZtXV1VFRUYCAgDo6OoyMjKmpqWVlZbW1tenp6Ts7O4GBgfv7+1NTU6CgoI6Ojl1dXWFhYTg4OGhoaPX19cbGxlBQUFtbW5GRkevr62dnZ7y8vIuLi7i4uPz8/KqqqmBgYKioqOHh4Wtrazc3N25ubre3t+Tk5NTU1DQ0NDw8PEBAQFRUVGlpaYqKik1NTWJiYjk5Oaurq5WVlZubm5+fn15eXru7u5mZmWNjY1VVVZeXl9nZ2a2trWRkZD8/P+3t7f39/XFxcY2Njfb29kdHR0lJSaGhocfHxz09Pezs7EFBQYODgzU1NbS0tE9PT/Pz8zMzM////////45unaAAAABVdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////wCwoQfPAAABaklEQVR42uzX107DMBQG4MMIpSTppOy9995773nS938WkGhCnfMb2TUSF/S/cpV8qpecY6rCRKngt8hAaj0ZUsjJmAJOFlRwsrOqJjuqcrK2dZrs7bemBmyiqREb61/A6pOToF0k6J+UmqSdYZjpHqEl3mG+yoxl1Gze5bgMsfrHh7yFRlkpsxi2xGuM52gF4tRLOb5vRSm+iBmXuMSanAGc7l4fl1pQlnyx2BL3asY8xQa4jR8h7gQ4krjLEEdN3MT/CVcg7jbDc6Mkc7Fugnd1x9CDxOIwKPKG79XydBO3PJ8XjU6SAdixU7Nj6D2hB7dDP0wYOHrrlir4HClpl6oK8Xnc3Gf2wvjHIMQp/cbXSbtweazdJPBbleM82iOhj7Gqt5mfX7NfmR2pNbL5ZV4w+D6H45pNsodxquMThdWOdIaP5jVlxR9WQ25FnFv56Fa4upXMbsW64zXB7YLieDVyvJRZXAc/BBgATEJGRWGfpZ4AAAAASUVORK5CYII=";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    window.app = this;
    this.state = {
      nodes: nodes,
      links: links,
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      svg: ''
    }
    this.velocityDecay = 0.1;
    this.linkDistance = 50;
    this.collideRadius = 20;
    this.collideStrength = 0.5;
    this.chargeStrength = -150;

    this.simulation = new Simulation({
      velocityDecay: this.velocityDecay,
      linkDistance: this.linkDistance,
      collideRadius: this.collideRadius,
      collideStrength: this.collideStrength,
      chargeStrength: this.chargeStrength,
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      nodeIdKey: 'nodeId',
      XYCenter: false
    })
    this.nodes = nodes.slice(0);
    this.links = links.slice(0);
    this.simulation.setNodesLinks(this.nodes, this.links);
    this.simulation.tick({
      end: () => {
        this.setState({
          svg: renderToString(<D3ReactForce nodes={this.nodes} links={this.links} nodeIdKey="nodeId" staticLayout={true}/>)
        })
      }
    })
  }

  componentDidMount() {
    window.onresiz = () => {
      this.setState({
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
      })
    }
  }

  onClick = e => {
    const { nodes } = this.state;
    nodes.push({
      nodeId: `index${index++}`
    })
    this.setState({
      nodes: nodes.slice(0)
    })
  }

  render() {
    const { nodes, links, width, height } = this.state;
    const {
      velocityDecay,
      linkDistance,
      collideRadius,
      collideStrength,
      chargeStrength
    } = this;
    return (<div>
      <div>
        <button onClick={this.onClick}>
          添加一个节点
        </button>
        <button onClick={() => { this.D3ReactForce.adaption() }}>
          居中
        </button>
        <br />
        摩擦系数：<input defaultValue={velocityDecay} onChange={e => this.velocityDecay = e.target.value}/><br />
        连线长度：<input defaultValue={linkDistance} onChange={e => this.linkDistance = e.target.value}/><br />
        碰撞半径：<input defaultValue={collideRadius} onChange={e => this.collideRadius = e.target.value}/><br />
        碰撞强度：<input defaultValue={collideStrength} onChange={e => this.collideStrength = e.target.value}/><br />
        作用力：<input defaultValue={chargeStrength} onChange={e => this.chargeStrength = e.target.value}/><br />
        <button onClick={() => {this.forceUpdate()}}>确定</button>
      </div>
      {/* <div dangerouslySetInnerHTML={{__html: this.state.svg}}></div> */}
    	<div style={{margin: 20, border: '1px solid #aaa', overflow: 'hidden'}}>
      	<D3ReactForce
          ref={c => this.D3ReactForce = c}
          nodes={nodes} links={links}
          nodeIdKey="nodeId"
          width={width}
          height={height}
          velocityDecay={velocityDecay}
          linkDistance={linkDistance}
          collideRadius={collideRadius}
          collideStrength={collideStrength}
          chargeStrength={chargeStrength}
          XYCenter={true}
          nodeClick={(d) => {
            console.log(d);
          }}
          tick={() => {
            // this.D3ReactForce.adaption();
          }}
          getLink={{
            stroke: '#859731',
            strokeWidth: 1
          }}
          getNode={(node) => {
            return <g transform="translate(-15, -15)">
              <image xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref={img} width="30" height="30"></image>
            </g>
          }}
        />
    	</div>

    </div>);
  }
}
