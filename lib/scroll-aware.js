'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function (Component) {
  var _class, _temp2;

  return _temp2 = _class = function (_React$Component) {
    _inherits(_scrollAware, _React$Component);

    function _scrollAware() {
      var _Object$getPrototypeO;

      var _temp, _this, _ret;

      _classCallCheck(this, _scrollAware);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(_scrollAware)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = {
        scrollableAncestor: null
      }, _this._componentHandleScroll = function (event) {
        if (!_this.Component.type.prototype._handleScroll) throw new Error('No `_handleScroll` method found on the returned Component instance');

        _this._componentHandleScroll = _this.Component.type.prototype._handleScroll.bind(_this.Component);
        _this._componentHandleScroll(event);
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(_scrollAware, [{
      key: '_handleScroll',
      value: function _handleScroll(event) {
        this._componentHandleScroll(event);
      }
    }, {
      key: 'componentDidMount',
      value: function componentDidMount() {
        if (!(0, _utils.getWindow)()) {
          return;
        }

        this._handleScroll = this.props.throttleHandler(this._handleScroll.bind(this));

        this.scrollableAncestor = this.props.scrollableAncestor || (0, _utils.findScrollableAncestor)(_reactDom2.default.findDOMNode(this));

        this.scrollableAncestor.addEventListener('scroll', this._handleScroll);
        window.addEventListener('resize', this._handleScroll);

        this.setState({ scrollableAncestor: this.scrollableAncestor });
        this._handleScroll(null);
      }
    }, {
      key: 'componentDidUpdate',
      value: function componentDidUpdate() {
        if (!(0, _utils.getWindow)()) {
          return;
        }

        // The element may have moved.
        this._handleScroll(null);
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        if (!(0, _utils.getWindow)()) {
          return;
        }

        // At the time of unmounting, the scrollable ancestor might no longer
        // exist. Guarding against this prevents the following error:
        //
        //   Cannot read property 'removeEventListener' of undefined
        this.scrollableAncestor && this.scrollableAncestor.removeEventListener('scroll', this._handleScroll);
        window.removeEventListener('resize', this._handleScroll);

        // cancel throttle function if is posible
        this.props.throttleHandler.cancel && this.props.throttleHandler.cancel.call(this);
      }

      /**
       * @return {Object}
       */

    }, {
      key: 'render',
      value: function render() {
        this.Component = _react2.default.createElement(Component, _extends({}, this.props, {
          scrollableAncestor: this.state.scrollableAncestor
        }));
        return this.Component;
      }
    }]);

    return _scrollAware;
  }(_react2.default.Component), _class.propTypes = {
    scrollableAncestor: _react.PropTypes.any,
    throttleHandler: _react.PropTypes.func
  }, _class.defaultProps = {
    throttleHandler: function throttleHandler(handler) {
      return handler;
    }
  }, _temp2;
};

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @param {function} Component
 * Calls a function when you scroll to the element.
 * @return {function}
 */