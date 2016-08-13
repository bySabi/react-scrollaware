import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { findScrollableAncestor, getWindow } from './utils';

/**
 * @param {function} Component
 * Calls a function when you scroll to the element.
 * @return {function}
 */
export default function(Component) {
  return class _scrollAware extends React.Component {
    static propTypes = {
      scrollableAncestor: PropTypes.any,
      throttleHandler: PropTypes.func
    }

    static defaultProps = {
      throttleHandler(handler) {
        return handler;
      }
    }

    state = {
      scrollableAncestor: null
    }

    _componentHandleScroll = (event) => {
      if (!this.Component.type.prototype._handleScroll) throw new Error('No `_handleScroll` method found on returned Component instance');

      this._componentHandleScroll = this.Component.type.prototype._handleScroll.bind(this.Component);
      this._componentHandleScroll(event);
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
      //
      //   Cannot read property 'removeEventListener' of undefined
      this.scrollableAncestor &&
        this.scrollableAncestor.removeEventListener('scroll', this._handleScroll);
      window.removeEventListener('resize', this._handleScroll);

      // cancel throttle function if is posible
      this.props.throttleHandler.cancel &&
        this.props.throttleHandler.cancel.call(this);
    }

    /**
     * @return {Object}
     */
    render() {
      this.Component = React.createElement(Component, { ...this.props,
        scrollableAncestor: this.state.scrollableAncestor
      });
      return this.Component;
    }
  }
}
