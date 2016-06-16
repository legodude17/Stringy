/*jslint node:true*/
'use strict';
var magicpen = require('magicpen'),
    tokenizer = require('stringtokenizer'),
    regs = require('./regs.js');
//var pen = magicpen({ indentationWidth: 4, format: 'ansi'});
function stringPattern(str) {
    
}
var stringy = {
    tokens: {
        createPattern: function (str) {
            function token(str, length) {
                str = str.replace(/(\{)?(\})?/g, '');
                return {
                    str: str,
                    length: length && +length
                };
            }
            var replacements, matcher = str, i, v, match,
                tokenized, tokens = [], r = {},
                reg1 = regs[0],
                reg2 = regs[1],
                reg3 = regs[2],
                reg4 = regs[3],
                reg5 = regs[4],
                reg6 = regs[5];
            replacements = str.match(reg1).map(function (v) {return reg2.exec(v) || v; });
            for (i = 0; i < replacements.length; i += 1) {
                v = replacements[i];
                match = reg3.exec(v);
                tokens.push(match ? (token(match[1], match[2] && match[2][1])) : token(v));
            }
            matcher.replace(reg5, function (str, name, num, i) {
                r[str] = '(.' + num.replace('[', '{').replace(']', '}') + '?)';
            });
            matcher.replace(reg6, function (str, name, num) {
                r[str] = '(.*?)';
            });
            for (i in r) {
                if (r.hasOwnProperty(i)) {
                    matcher = matcher.replace(i, r[i]);
                }
            }
            matcher = "^" + matcher + "$";
            tokenized = {
                template: str,
                matcher: new RegExp(matcher, 'g'),
                tokens: tokens
            };

            return tokenized;
        },
        parse: function (str, matcher) {
            var match = matcher.matcher.exec(str),
                parsed = {},
                i;
            if (!match) {
                return;
            }
            for (i = 0; i < matcher.tokens.length; i += 1) {
                parsed[matcher.tokens[i].str] = match[i + 1];
            }
            return parsed;
        },
        tokenize: function (str) {
            function tokenizeWord(word, place) {
                var num = parseFloat(word, 10);
                if (num) {
                    return {
                        type: 'number',
                        value: num,
                        line: place.line,
                        column: place.column
                    };
                } else {
                    return {
                        type: 'string',
                        value: word,
                        line: place.line,
                        column: place.column
                    };
                }
            }
            var lines = str.split('\n'),
                words = lines.map(function (v) {
                    return v.split(' ');
                }),
                tokens = [];
            words.forEach(function (v, i) {
                v.forEach(function (v, j) {
                    if (!v) {
                        return;
                    }
                    tokens.push(tokenizeWord(v, {line: i, column: j}));
                });
            });
            return tokens;
        }
    }
};
stringy.parsers = {
    patterns: {
        email: stringy.tokens.createPattern('{name}@{domain}.{ext[3]}'),
        phone_number: stringy.tokens.createPattern('{areacode[3]} - {firstpart[3]} - {secondpart[4]}')
    },
    email: function (str) {
        return stringy.tokens.parse(str, stringy.parsers.patterns.email);
    },
    phone_number: function (str) {
        return stringy.tokens.parse(str, stringy.parsers.patterns.phone_number);
    }
};
module.exports = stringy;