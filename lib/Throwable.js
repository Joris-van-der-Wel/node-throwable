'use strict';

/** todo
 *
 * @module Throwable
 * @author Joris van der Wel <joris@jorisvanderwel.com>
 */

/** todo
 * @constructor
 * @augments Error
 * @alias module:Throwable
 * @param {!Error} wrapped
 * @example new Throwable(Error('Hrm'));
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
