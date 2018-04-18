import React from 'react';
import D3ReactForce from './D3ReactForce';
import data from './data.json';
const { nodes, links } = data;

export default class App extends React.Component {
  render() {

    return (<div>
      <D3ReactForce nodes={nodes} links={links} nodeIdKey="nodeId"/>
    </div>);
  }
}
