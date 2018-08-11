import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
const MOUNT_NODE = document.getElementById('app');


let render = () => {
  ReactDOM.render(
    <App />
    , MOUNT_NODE);
}

try {
  render()
} catch (e) {
  console.error(e);
}

// if (module.hot) {
//   module.hot.accept(['./app'], () => {
//     setTimeout(() => {
//       ReactDOM.unmountComponentAtNode(MOUNT_NODE);
//       render();
//     });
//   });
// }
