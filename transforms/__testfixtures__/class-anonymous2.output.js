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
        comp1: class extends React.Component {
          render() {
            return <div/>;
          }
        },
        comp2: CrazyObject.method.wrapThatGuy(class extends React.Component {
          render() {
            return <div/>;
          }
        }),
        waitWhatArrayForReal: [class extends React.Component {
          render() {
            return <div/>;
          }
        }, [class extends React.Component {
          render() {
            return <p/>;
          }
        }, class extends React.Component {
          render() {
            return <span/>;
          }
        }]],
      },
    },
  },
};

module.exports = WaltUtils;
