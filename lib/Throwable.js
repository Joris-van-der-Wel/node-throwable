'use strict';

/** Inherit from Error without performance penalties, `instanceof` behaves as expected and the error stack is correct.
 * This module can be used cross-browser using Browserify.
 *
 * @module Throwable
 * @author Joris van der Wel <joris@jorisvanderwel.com>
 */

/** Constructs a new Throwable by wrapping around an Error() (a decorator).
 * All of Error's properties and methods are proxied to this wrapped Error.
 * This ensures the "stack" is correct without having to inspect this stack
 * during the construction of Throwable (which would have been slow).
 * Throwable has its prototype chained to Error, which means that (new Throwable()
 * instanceof Error) is true.
 * You can inherit from this class by using normal prototype chaining
 * (for example using util.inherits). Make sure you also call the Throwable
 * constructor function in your own constructor.
 * @constructor
 * @augments Error
 * @alias module:Throwable
 * @param {!Error} wrapped
 * @example throw new Throwable(Error('Hrm'));
 */
function Throwable(wrapped)
{
        if (!(this instanceof Throwable))
        {
                return new Throwable(wrapped);
        }

        /* istanbul ignore if */
        if (typeof wrapped !== 'object')
        {
                throw Error('Throwable should wrap an Error');
        }

        // Wrap the Error so that the stack, lineNumber, fileName, etc is correct
        this.wrapped = wrapped;
        this.wrapped.name = 'Throwable';
}

function wrap(attr)
{
        Object.defineProperty(Throwable.prototype, attr, {
                configurable: true,
                enumerable: false,
                get: function()
                {
                        return this.wrapped ? this.wrapped[attr] : /* istanbul ignore next */ void 123;
                },
                set: function(value)
                {
                        this.wrapped[attr] = value;
                }
        });
}

Throwable.prototype = Object.create(global.Error.prototype);
Throwable.prototype.constructor = Throwable;

wrap('name');
wrap('message');
wrap('stack');
wrap('fileName');
wrap('lineNumber');
wrap('columnNumber');

Throwable.prototype.toString = function()
{
        return this.wrapped.toString();
};

module.exports = Throwable;
