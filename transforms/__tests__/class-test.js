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
};

defineTest(__dirname, 'class');
defineTest(__dirname, 'class', {flow: true}, 'class-anonymous');
defineTest(__dirname, 'class', pureMixinAlternativeOption, 'class-test2');
defineTest(__dirname, 'class', {flow: true}, 'export-default-class');
defineTest(__dirname, 'class', pureMixinAlternativeOption, 'class-pure-mixin1');
defineTest(__dirname, 'class', {flow: true}, 'class-pure-mixin2');
defineTest(__dirname, 'class', {flow: true}, 'class-initial-state');
defineTest(__dirname, 'class', {flow: true}, 'class-property-field');
defineTest(__dirname, 'class', {flow: true}, 'class-flow1');
defineTest(__dirname, 'class', {flow: true}, 'class-flow2');
defineTest(__dirname, 'class', {flow: true}, 'class-flow3');
defineTest(__dirname, 'class', {flow: true}, 'class-flow4');
defineTest(__dirname, 'class', {flow: true}, 'class-flow5');
