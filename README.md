# React scroll-aware Higher-order Component

[![npm version](https://badge.fury.io/js/react-scrollaware.svg)](https://badge.fury.io/js/react-scrollaware)

A React HoC component for create `scroll-aware` wrapped components. Works in all containers that can scroll, including the `window`

> The intended purpouse of this component is abstract a well tested scroll event handler pattern and build complex scroll behaviours on top of it.

## Installation

### npm

```bash
npm install react-scrollaware --save
```

## Usage

```javascript
// scrolled-min.jsx
import React from 'react';
import scrollAware from 'react-scrollaware';

export const ScrolledMinimal = scrollAware(class extends React.Component {
  _handleScroll(event) {
    console.log('scrolled: ', event);
  }

  render() {
    return <span style={{fontSize: 0}} />;
  }
})
```

### What is need to know?

* This example represent the minimal posible setup. Any wrapped scroll-aware component must have a `_handleScroll` class method.

* Component´s `_handleScroll` will fired wherever ocurr a `onScroll` event in the scrollable ancestor or get `resized`

* Filtering scroll events relay on wrapped component.


## Prop types
```javascript
  propTypes: {
    /**
     * Scrollable Ancestor - A custom ancestor is useful in cases where
     * you do not want the immediate scrollable ancestor or `window` to be
     * the container.
     */
    scrollableAncestor: PropTypes.any,

    /**
     * The `throttleHandler` prop provides a function that throttle the internal
     * scroll handler to increase performance.
     * See the section on "Throttling" for details on how to use it.
     */
    throttleHandler: PropTypes.func,
  },
```

## Containing elements and `scrollableAncestor`
`react-scrollaware` attach the event handler to first scrollable ancestor of the wrapped component.

If that algorithm doesn't work for your use case, then you might find the
`scrollableAncestor` prop useful. It allows you to specify what the scrollable
ancestor is. Pass a node as that prop, and the `react-scrollaware` will use the scroll
position of *that* node, rather than its first scrollable ancestor.

## Throttling
By default, `react-scrollaware` will trigger on every scroll event. In most cases, this
works just fine. But if you find yourself wanting to tweak the scrolling
performance, the `throttleHandler` prop can come in handy. You pass in a
function that returns a different (throttled) version of the function passed
in. Here's an example using
[lodash.throttle](https://www.npmjs.com/package/lodash.throttle):

```jsx
// scrolled-min-throttle.jsx
import React from 'react';
import throttle from 'lodash.throttle';
import { ScrolledMinimal } from './scrolled-min';

export function ScrolledMinimalThrottle200(props) {
  return React.createElement(ScrolledMinimal, {
   ...props,
   throttleHandler: (scrollHandler) => throttle(scrollHandler, 200)
  });
}

```

The argument passed in to the throttle handler function, `scrollHandler`, is
`react-scrollaware` internal scroll handler. The `throttleHandler` is only invoked once
during the lifetime of a `react-scrollaware` (when is mounted).

To prevent errors coming from the fact that the scroll handler can be called
after the `react-scrollaware` is unmounted, it's a good idea to cancel the throttle
function on unmount. If used throttle function have a `cancel` function, `react-scrollaware` will call it on component unmount.

## Troubleshooting
If your component isn't working the way you expect it to. Clone and modify the project locally.
- clone this repo
- add `console.log` or breakpoints where you think it would be useful.
- `npm link` in the react-scrollaware repo.
- `npm link react-scrollaware` in your project.
- if needed rebuild react-scrollaware module: `npm run build-npm`

### Local development advice
This package have `peerDependencies` on 'React' and 'React-DOM' modules. Don't install `react` or `react-dom` on local `react-scrollaware` if they had been previously installed on your app project. Many local `react` and `react-dom` package instances conflict between them. One way to solved is:
```bash
cd "current App project"/node_modules/react
npm link

cd react-scrollaware
npm link react
```
Repeat steps for `react-dom`

## Example

[react-scrolled](https://github.com/bySabi/react-scrolled) WIP project, is a library of scroll behaviours components and HoC.


## Credits

This project is based on [React Waypoint](https://github.com/brigade/react-waypoint) team and contributors code.

## Contributing

* Documentation improvement
* Feel free to send any PR

## License

[ISC][isc-license]

[isc-license]:./LICENSE
