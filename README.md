# passcheck

[![Build Status](https://api.travis-ci.org/scniro/passcheck.svg)](https://travis-ci.org/scniro/passcheck)

a policy driven password strength checker

- [AngularJS wrapper/api](http://ng-passcheck.azurewebsites.net/)

```
<npm|bower> install passcheck
```

### api

```javascript
var passcheck = require('./passcheck'); // -- nodejs. window.passcheck -- browser
```

##### `passcheck.config.get()`
 - returns the configuration

##### `passcheck.config.set(options)`
 - sets and overrides the default configuration

##### `passcheck.eval('password')`
 - returns results


 http://ng-passcheck.azurewebsites.net/

```javascript


var result = passcheck.eval('Password123!');

// { weak: false, medium: false, strong: true, score: 76.5 }

passcheck.config.set({
    common: {
        test: true,
        path: './passwords.json' // 10k common passwords
    }
});

var result = passcheck.eval('password');

// { weak: true, medium: false, strong: false, score: 0, common: true }

```