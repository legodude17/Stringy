# Strings and tokens
A module for working with strings.
## Installation
    npm install --save strings-and-tokens

## Usage
```js
var strings = require('strings-and-tokens');
var pattern = strings.tokens.createPattern('{name}@{domain}.{ext[3]}');
console.log(strings.tokens.parse('example@example.com'), pattern); // {name: 'example', domain: 'example': ext: 'com'}
```
or
```js
var strings = require('strings-and-tokens');
console.log(strings-and-tokens.parsers.email('example@example.com'));
```
You could also tokenize a string.
```js
var strings = require('strings-and-tokens');
console.log(strings.tokens.tokenize('Good afternoon!'));
```
This gives an array of words.
A word is an object like:
```
{
    type: 'string' or 'number',
    value: string or number,
    line: number
    column: number
}
```

## Testing
    npm test
Requires [mocha](https://mochajs.org) and [Unexpected](http://unexpected.js.org/).