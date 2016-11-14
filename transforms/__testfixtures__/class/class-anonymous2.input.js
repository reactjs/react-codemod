/**
 * @flow
 */
/* eslint-disable no-use-before-define */
'use strict';

var React = require('React');

var CrazyObject = {
  foo: {
    bar: 123,
  },
  method: {
    wrapThisGuy: (x) => x,
    deep: {
      wrapThatGuy: (x) => x,
    },
  },
  iDontUnderstand: {
    whyYouDoThis: {
      butAnyway: {
        comp1: React.createClass({
          render() {
            return <div/>;
          },
        }),
        comp2: CrazyObject.method.wrapThatGuy(React.createClass({
          render() {
            return <div/>;
          },
        })),
        waitWhatArrayForReal: [React.createClass({
          render() {
            return <div/>;
          },
        }), [React.createClass({
          render() {
            return <p/>;
          },
        }), React.createClass({
          render() {
            return <span/>;
          },
        })]],
      },
    },
  },
};

module.exports = WaltUtils;
