# passcheck

[![Build Status](https://api.travis-ci.org/scniro/passcheck.svg)](https://travis-ci.org/scniro/passcheck)

a policy driven password strength checker

```
npm install passcheck
```

### api

```javascript
var passcheck = require('./passcheck'); // -- nodejs. window.passcheck -- browser
```

##### `passcheck.config(options)`
 - overrides the default configuration

 ##### `passcheck.eval('password')`
  - returns results

```javascript
// -- demo
```