node-throwable
==============
Inherit from Error without performance penalties, `instanceof` behaves as expected and the error stack is correct. This library can be used cross-browser using Browserify.

Usage
-----
A lot of solutions for inheriting from `Error` in javascript is error-prone (pun intended) and tricky.

Using this library you can inherit `Error` just like you would inherit from any other javascript object/class.
Here is an example using the [inherits](https://www.npmjs.com/package/inherits) library.

```javascript
var Throwable = require('throwable');

function MyError(wrapped)
{
        Throwable.call(this, wrapped);
        this.name = 'MyError';
}

require('inherits')(MyError, Throwable);
```

And this is how you can throw your error:
```javascript
function failure()
{
        throw new MyError(Error('Something went wrong!'));
}
```

Advantages
----------
This library has a few advantage some other solutions might not have:

Using `instanceof` wil work as expected:

```javascript
try
{
        failure();
}
catch(err)
{
        console.log(err instanceof Error); // true
        console.log(err instanceof Throwable); // true
        console.log(err instanceof MyError); // true
}
```

And the `stack`, `fileName` (firefox), `lineNumber` (firefox) attributes will be set correctly (instead of pointing to a line in the Throwable constructor).

Also, the `stack` attribute is accessed only when you need it, `Error.captureStackTrace` is not used either. Accessing any of these two is a big performance hit in Node.js and Chrome.
