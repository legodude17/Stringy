/*jslint node:true*/
/*global describe, it*/
'use strict';
var expect = require('unexpected'),
    stringy = require('./index.js'),
    fs = require('fs');
describe('stringy', function () {
    describe('.tokens', function () {
        var pattern;
        describe('.createPattern', function () {
            it('works', function () {
                pattern = stringy.tokens.createPattern('{name}@{domain}.{ext[3]}');
                expect(pattern, 'to be an', 'object');
                expect(pattern, 'to exhaustively satisfy', {
                    tokens: [
                        {
                            str: 'name',
                            length: undefined
                        },
                        {
                            str: 'domain',
                            length: undefined
                        },
                        {
                            length: 3,
                            str: 'ext'
                        }
                    ],
                    matcher: /^(.*?)@(.*?).(.{3}?)$/g,
                    template: '{name}@{domain}.{ext[3]}'
                });
            });
        });
        describe('.parse', function () {
            it('works', function () {
                var res = stringy.tokens.parse('legodudejb@gmail.com', pattern);
                expect(res, 'to be an', 'object');
                expect(res, 'to satisfy', {
                    name: 'legodudejb',
                    domain: 'gmail',
                    ext: 'com'
                });
            });
        });
        describe('.tokenize', function () {
            it('should work on a single line', function () {
                var tokens = stringy.tokens.tokenize('hi my name is joshua and I am 14 years old.');
                expect(tokens, 'to be a', 'array');
                expect(tokens, 'to have items satisfying', {
                    line: expect.it('to be a number'),
                    column: expect.it('to be a number'),
                    value: expect.it('to be ok'),
                    type: expect.it('to be a string')
                });
            });
            it('should work on multiple lines', function () {
                var tokens = stringy.tokens.tokenize('hi my name is joshua and I am 14 years old.\nI have 1 sister who is 11 years old.\n I am 3 years older and 3 days older.');
                expect(tokens, 'to be a', 'array');
                expect(tokens, 'to have items satisfying', {
                    line: expect.it('to be a number'),
                    column: expect.it('to be a number'),
                    value: expect.it('to be ok'),
                    type: expect.it('to be a string')
                });
            });
            it('should work on an indented string', function (done) {
                fs.readFile('./package.json', function (err, data) {
                    expect(err, 'to be falsy');
                    expect(data, 'to be an', 'Buffer');
                    expect(data.toString(), 'to be a string');
                    var tokens = stringy.tokens.tokenize(data.toString());
                    expect(tokens, 'to be a', 'array');
                    expect(tokens, 'to have items satisfying', {
                        line: expect.it('to be a number'),
                        column: expect.it('to be a number'),
                        value: expect.it('to be ok'),
                        type: expect.it('to be a string')
                    });
                    done();
                });
            });
            it('should work on a large file', function (done) {
                fs.readFile('./index.js', function (err, data) {
                    expect(err, 'to be falsy');
                    expect(data, 'to be an', 'Buffer');
                    expect(data.toString(), 'to be a string');
                    var tokens = stringy.tokens.tokenize(data.toString());
                    expect(tokens, 'to be a', 'array');
                    expect(tokens, 'to have items satisfying', {
                        line: expect.it('to be a number'),
                        column: expect.it('to be a number'),
                        value: expect.it('to be ok'),
                        type: expect.it('to be a string')
                    });
                    done();
                });
            });
        });
    });
    describe('.parsers', function () {
        describe('.email', function () {
            it('should work', function () {
                var res = stringy.parsers.email('example@example.com');
                expect(res, 'to be an object');
                expect(res, 'to satisfy', {
                    name: 'legodudejb',
                    domain: 'gmail',
                    ext: 'com'
                });
            });
        });
        describe('.phone_number', function () {
            it('should work', function () {
                var res = stringy.parsers.phone_number('000 - 111 - 2222');
                expect(res, 'to be an object');
                expect(res, 'to satisfy', {
                    areacode: '650',
                    firstpart: '649',
                    secondpart: '9191'
                });
            });
        });
    });
});