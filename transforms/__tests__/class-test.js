/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

const defineTest = require('jscodeshift/dist/testUtils').defineTest;

const pureMixinAlternativeOption = {
  'mixin-module-name': 'ReactComponentWithPureRenderMixin',
  'pure-component': true,
};

const enableFlowOption = {flow: true};

defineTest(__dirname, 'class');
defineTest(__dirname, 'class', enableFlowOption, 'class-anonymous');
defineTest(__dirname, 'class', enableFlowOption, 'class-anonymous2');
defineTest(__dirname, 'class', pureMixinAlternativeOption, 'class-test2');
defineTest(__dirname, 'class', enableFlowOption, 'export-default-class');
defineTest(__dirname, 'class', pureMixinAlternativeOption, 'class-pure-mixin1');
defineTest(__dirname, 'class', {
  ...enableFlowOption,
  'pure-component': true,
}, 'class-pure-mixin2');
defineTest(__dirname, 'class', null, 'class-pure-mixin3');
defineTest(__dirname, 'class', {
  ...pureMixinAlternativeOption,
  ...enableFlowOption,
}, 'class-pure-mixin4');
defineTest(__dirname, 'class', {
  ...pureMixinAlternativeOption,
  ...enableFlowOption,
}, 'class-top-comment');
defineTest(__dirname, 'class', {
  ...pureMixinAlternativeOption,
  ...enableFlowOption,
}, 'class-access-default-props1');
defineTest(__dirname, 'class', enableFlowOption, 'class-initial-state');
defineTest(__dirname, 'class', enableFlowOption, 'class-property-field');
defineTest(__dirname, 'class', enableFlowOption, 'class-flow1');
defineTest(__dirname, 'class', enableFlowOption, 'class-flow2');
defineTest(__dirname, 'class', enableFlowOption, 'class-flow3');
defineTest(__dirname, 'class', enableFlowOption, 'class-flow4');
defineTest(__dirname, 'class', enableFlowOption, 'class-flow5');
defineTest(__dirname, 'class', enableFlowOption, 'class-flow6');
defineTest(__dirname, 'class', {
  ...enableFlowOption,
  'remove-runtime-proptypes': true,
}, 'class-flow7');
