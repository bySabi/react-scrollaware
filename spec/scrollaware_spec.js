import React from 'react';
import ReactDOM from 'react-dom';
import test from 'tape';
import scrollAware from '../src/scroll-aware';

let div;

const renderAttached = function(component) {
  div = document.createElement('div');
  document.body.appendChild(div);
  const renderedComponent = ReactDOM.render(component, div);
  return renderedComponent;
};

export const ScrolledTest = scrollAware(class extends React.Component {
  _handleScroll(event) {}

  render() {
    return <span style={{fontSize: 0}} />;
  }
});

test('<ScrolledTest/>', t => {
  t.test('setup', t => {
    t.end();
  });

  t.ok('ok');
  t.end();
});
