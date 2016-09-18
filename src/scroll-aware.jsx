import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { findScrollableAncestor, getWindow } from './utils';
import warning from 'fbjs/lib/warning';

/**
 * @param {function} Component
 * Calls a function when you scroll to the element.
 * @return {function}
 */
export default function(Component) {
  return class _scrollAware extends React.Component {
    static propTypes = {
      scrollableAncestor: PropTypes.any,
      throttleHandler: PropTypes.func,
      handleScroll: PropTypes.string
    }

    static defaultProps = {
      throttleHandler(handler) {
        return handler;
      },
      handleScroll: '_handleScroll'
    }

    state = {
      scrollableAncestor: null
    }

    _componentHandleScroll = (event) => {
      if (this.Component.type.prototype[this.props.handleScroll]) {
        this._componentHandleScroll = this.Component.type.prototype[this.props.handleScroll].bind(this.Component);
        this._componentHandleScroll(event);
      }
      warning(this.Component.type.prototype[this.props.handleScroll], `[scrollAware]: Returned Component instance does not have a "${this.props.handleScroll}" class method`);
    }

    _handleScroll(event) {
      this._componentHandleScroll(event);
    }

    componentDidMount() {
      if (!getWindow()) {
        return;
      }

      this._handleScroll = this.props.throttleHandler(this._handleScroll.bind(this));
      this.scrollableAncestor = this.props.scrollableAncestor ||
        findScrollableAncestor(ReactDOM.findDOMNode(this));
      this.scrollableAncestor.addEventListener('scroll', this._handleScroll);
      window.addEventListener('resize', this._handleScroll);

      this.setState({ scrollableAncestor: this.scrollableAncestor });
    }

    componentDidUpdate() {
      if (!getWindow()) {
        return;
      }

      // The element may have moved.
      this._handleScroll(null);
    }

    componentWillUnmount() {
      if (!getWindow()) {
        return;
      }

      // At the time of unmounting, the scrollable ancestor might no longer
      // exist. Guarding against this prevents the following error:
      //   Cannot read property 'removeEventListener' of undefined
      this.scrollableAncestor &&
        this.scrollableAncestor.removeEventListener('scroll', this._handleScroll);
      window.removeEventListener('resize', this._handleScroll);

      // cancel throttle function if possible
      this.props.throttleHandler.cancel &&
        this.props.throttleHandler.cancel.call(this);
    }

    // Every wrapped component, one start, must be rendered two times cause their
    // rendered DOM node is needed for find an scrollable ancestor container
    render() {
      const { scrollableAncestor, throttleHandler, handleScroll, ...props } = this.props; // eslint-disable-line no-unused-vars
      this.Component = React.createElement(Component,
        { ...props, scrollableAncestor: this.state.scrollableAncestor });
      return this.Component;
    }
  }
}
