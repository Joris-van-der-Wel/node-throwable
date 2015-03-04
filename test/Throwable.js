'use strict';

var Throwable = require('..');

module.exports = {
        'Invalid argument': function(test)
        {
                /* jshint -W031 */
                test.throws(function()
                {
                        new Throwable();
                });

                test.throws(function()
                {
                        new Throwable('invalid');
                });
                test.done();
        },
        'construction': function(test)
        {
                var wrapped = new Throwable(new Error('My error message'));

                test.strictEqual(wrapped.name, 'Throwable');
                test.strictEqual(wrapped.message, 'My error message');
                test.ok(wrapped instanceof Throwable);
                test.ok(wrapped instanceof Error);
                test.done();
        },
        'construction as function': function(test)
        {
                /* jshint -W064 */
                var wrapped = Throwable(Error('My error message'));

                test.strictEqual(wrapped.name, 'Throwable');
                test.strictEqual(wrapped.message, 'My error message');
                test.ok(wrapped instanceof Throwable);
                test.ok(wrapped instanceof Error);
                test.done();
        },
        'stack': function(test)
        {
                var err = Error();
                var wrapped = new Throwable(err);

                test.strictEqual(err.stack, wrapped.stack);
                test.done();
        },
        'lazy stack': function(test)
        {
                // accessing .stack or Error.captureStackTrace is slow
                // (captureStackTrace is also chrome only)
                var err = Object.create({}, {
                        stack: {
                                get: function()
                                {
                                        throw Error('Do not access me');
                                }
                        }
                });

                var captureStackTrace = Error.captureStackTrace;
                Error.captureStackTrace = function()
                {
                        throw Error('Do not call me');
                };

                try
                {
                        var wrapped = new Throwable(err);
                        test.ok(wrapped);
                        test.done();
                }
                finally
                {
                        Error.captureStackTrace = captureStackTrace;
                }
        },
        'toString()': function(test)
        {
                var err = Error();
                var wrapped = new Throwable(err);

                err.toString = function(){ return 'foobar'; };

                test.strictEqual(wrapped.toString(), 'foobar');
                test.done();
        },
        'attributes': function(test)
        {
                var err = Error();
                var wrapped = new Throwable(err);

                err.name = 'a';
                err.message = 'b';
                err.stack = 'c';
                err.fileName = 'd';
                err.lineNumber = 'e';
                err.columnNumber = 'f';

                test.strictEqual(wrapped.name, 'a');
                test.strictEqual(wrapped.message, 'b');
                test.strictEqual(wrapped.stack, 'c');
                test.strictEqual(wrapped.fileName, 'd');
                test.strictEqual(wrapped.lineNumber, 'e');
                test.strictEqual(wrapped.columnNumber, 'f');

                test.done();
        },
        'inheriting': function(test)
        {
                function MyError(wrapped)
                {
                        Throwable.call(this, wrapped);
                        this.name = 'MyError';
                }

                require('inherits')(MyError, Throwable);

                var myError = new MyError(Error('Foo bar error message'));

                test.strictEqual(myError.name, 'MyError');
                test.strictEqual(myError.message, 'Foo bar error message');
                test.ok(myError instanceof MyError);
                test.ok(myError instanceof Throwable);
                test.ok(myError instanceof Error);
                test.done();
        }
};