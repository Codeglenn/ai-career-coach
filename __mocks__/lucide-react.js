const React = require('react');

// Return a generic SVG-like component for any icon import
module.exports = new Proxy({}, {
  get() {
    return (props) => React.createElement('svg', props, props.children || null);
  }
});
