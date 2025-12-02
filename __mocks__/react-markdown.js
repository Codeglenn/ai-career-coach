const React = require('react');
module.exports = function ReactMarkdown(props) {
  return React.createElement('div', {}, props.children || null);
};
