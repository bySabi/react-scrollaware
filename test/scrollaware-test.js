import React from 'react';
import test from 'tape';
import td from 'testdouble';
import { mount } from 'enzyme';
import throttle from 'lodash.throttle';
import scrollAware from '../src/scroll-aware';

// 'component' mounted attached to div container appended to
// document 'body' ensure it's scrollable
const mountAttached = function(component) {
  const div = document.createElement('div');
  document.body.appendChild(div);
  const renderedComponent = mount(component, { attachTo: div });
  return renderedComponent;
};

const scrollNodeTo = function(node, scrollTop) {
  if (node === window) {
    window.scroll(0, scrollTop);
  } else {
    node.scrollTop = scrollTop;
  }
  const event = document.createEvent('Event');
  event.initEvent('scroll', false, false);
  node.dispatchEvent(event);
};

test('<ScrolledTest>', t => {
  t.test('wrapped component', t => {
    t.test('rendered html', t => {
      let wrapper;
      t.test('setup', t => {
        const ScrolledTest = scrollAware(class extends React.Component {
          _handleScroll() {}
          render() {
            return <span style={{fontSize: 0}} />;
          }
        });
        wrapper = mount(<ScrolledTest />);
        t.end();
      });

      t.test('rendered html', t => {
        t.equal(wrapper.html(), '<span style="font-size: 0px;"></span>');
        t.end();
      });

      t.test('tearDown', t => {
        wrapper.unmount();
        t.end();
      });
      t.end();
    });

    t.test('wrapped rendered 2 times', t => {
      let wrapper;
      let _render;
      t.test('setup', t => {
        _render = td.function('_render');
        const ScrolledTest = scrollAware(class extends React.Component {
          _handleScroll() {}
          render() {
            _render();
            return <span style={{fontSize: 0}} />;
          }
        });
        wrapper = mount(<ScrolledTest />);
        t.end();
      });

      t.test('wrapped rendered 2 times', t => {
        t.equal(td.explain(_render).callCount, 2);
        t.end();
      });

      t.test('tearDown', t => {
        wrapper.unmount();
        td.reset();
        t.end();
      });
      t.end();
    });
  });

  t.test('handleScroll prop', t => {
    let wrapper;
    let ScrolledTest;
    let _customHandleScroll;
    t.test('setup', t => {
      _customHandleScroll = td.function('_customHandleScroll');
      ScrolledTest = scrollAware(class extends React.Component {
        _customHandleScroll(event) {
          _customHandleScroll(event);
        }
        render() {
          return <span style={{fontSize: 0}} />;
        }
      });
      wrapper = mount(<ScrolledTest handleScroll="_customHandleScroll" />);
      t.end();
    });

    t.test('handleScroll prop', t => {
      const explain = td.explain(_customHandleScroll);
      // First generated event come from component move/update and is unmanaged, always occur.
      t.equal(explain.callCount, 1);
      t.end();
    });

    t.test('tearDown', t => {
      wrapper.unmount();
      td.reset();
      t.end();
    });
    t.end();
  });

  t.test('never called handleScroll', t => {
    let wrapper;
    let ScrolledTest;
    let _customHandleScroll;
    t.test('setup', t => {
      _customHandleScroll = td.function('_customHandleScroll');
      ScrolledTest = scrollAware(class extends React.Component {
        _customHandleScroll(event) {
          _customHandleScroll(event);
        }
        render() {
          return <span style={{fontSize: 0}} />;
        }
      });
      wrapper = mount(<ScrolledTest />);
      t.end();
    });

    t.test('never called handleScroll', t => {
      const explain = td.explain(_customHandleScroll);
      // default _handleScroll class method is not set
      // _customHandleScroll must be pass it in prop 'handleScroll'
      t.equal(explain.callCount, 0);
      t.end();
    });

    t.test('tearDown', t => {
      wrapper.unmount();
      td.reset();
      t.end();
    });
    t.end();
  });

  t.test('captured scroll event', t => {
    let wrapper;
    let _handleScroll;
    t.test('setup', t => {
      _handleScroll = td.function('_handleScroll');
      const ScrolledTest = scrollAware(class extends React.Component {
        _handleScroll(event) {
          _handleScroll(event);
        }
        render() {
          return <span style={{fontSize: 0}} />;
        }
      });

      const parentStyle = {
        height: 100,  // parentHeight
        overflow: 'auto',
        position: 'relative',
        width: 100,
        margin: 10  // Normalize the space above the viewport.
      }
      wrapper = mountAttached(
        <div style={parentStyle}>
          <div style={{height: 0}} />
          <ScrolledTest />
          <div style={{height: 0}} />
        </div>
      );
      t.end();
    });

    t.test('captured scroll event', t => {
      // First generated event come from component move/update and is unmanaged, always occur.
      // Create 3 scroll events.
      scrollNodeTo(wrapper.instance(), 1); // enzyme API instance() return the 'DOM node'
      scrollNodeTo(wrapper.instance(), 1);
      scrollNodeTo(wrapper.instance(), 1);
      t.equal(td.explain(_handleScroll).callCount, 4);
      t.end();
    });

    t.test('tearDown', t => {
      wrapper.unmount();
      td.reset();
      scrollNodeTo(window, 0);
      t.end();
    });
    t.end();
  });

  t.test('throttleHandler prop', t => {
    let wrapper;
    let _handleScroll;
    t.test('setup', t => {
      _handleScroll = td.function('_handleScroll');
      const ScrolledTest = scrollAware(class extends React.Component {
        _handleScroll(event) {
          _handleScroll(event);
        }
        render() {
          return <span style={{fontSize: 0}} />;
        }
      });

      const parentStyle = {
        height: 100,  // parentHeight
        overflow: 'auto',
        position: 'relative',
        width: 100,
        margin: 10  // Normalize the space above the viewport.
      }
      wrapper = mountAttached(
        <div style={parentStyle}>
          <div style={{height: 0}} />
          <ScrolledTest throttleHandler={(scrollHandler) => throttle(scrollHandler, 100)} />
          <div style={{height: 0}} />
        </div>
      );
      t.end();
    });

    t.test('throttleHandler prop captured scroll event', t => {
      // First generated event come from component move/update and is unmanaged, always occur.
      // Create 1 scroll events.
      scrollNodeTo(wrapper.instance(), 1);  // first scroll event is ignored due throttle delay
      t.equal(td.explain(_handleScroll).callCount, 1);
      t.end();
    });

    t.test('tearDown', t => {
      wrapper.unmount();
      td.reset();
      scrollNodeTo(window, 0);
      t.end();
    });
    t.end();
  });

  t.test('scrollableAncestor prop', t => {
    let wrapper;
    let scrollableAncestor;
    t.test('setup', t => {
      scrollableAncestor = td.function('scrollableAncestor');
      const ScrolledTest = scrollAware(class extends React.Component {
        _handleScroll() {}
        render() {
          scrollableAncestor(this.props);
          return <span style={{fontSize: 0}} />;
        }
      });
      wrapper = mount(<ScrolledTest />);
      t.end();
    });

    t.test('scrollableAncestor prop', t => {
      const explain = td.explain(scrollableAncestor);
      const first = explain.calls[0].args[0].scrollableAncestor;
      const second = explain.calls[1].args[0].scrollableAncestor;
      t.equal(first, null);     // First render always pass scrollableAncestor 'null'
      t.equal(second, window);
      t.end();
    });

    t.test('tearDown', t => {
      wrapper.unmount();
      td.reset();
      t.end();
    });
    t.end();
  });
  t.end();
});
