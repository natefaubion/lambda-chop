lambda-chop
===========

Sweet.js macros for lambdas with currying, bound functions, and placeholders.

Install
-------

    npm install -g sweet.js
    npm install lambda-chop
    sjs -m lambda-chop/macros myfile.js

Features
--------

Lambda-chop provides a macro `λ` which you can use to create terse, 'stabby'
lambdas, much like CoffeeScipt and ES6, but with some extra features:

*   `->` for unbound functions
*   `=>` for bound functions using `Function::bind`
*   Tupled arguments
*   Curried arguments
*   Partials with placeholders
*   Shorthand property lambdas

Examples
--------

```js
// Create unbound functions
var add = λ(x, y) -> x + y;
add(1, 2) === 3;

// Create bound functions
DB.getResource('foo', λ(err, resp) => {
  ...
});

// Curry functions by leaving off the tupled arguments
var always = λ x y -> x;
always(42)(12) === 42;

// Mix and match for multiple argument lists
var nonsense = λ(x, y)(s, t) f -> 42;

// Placeholders using square brackets and `#`
var str = λ[#.toString()];
var sub = λ[# - #];
sub(2, 1) === 1;

// Shorthand property lambdas
var names = arr.map(λ.name);
```

Placeholder partials are never curried or bound, and are always expressions.

Can I Use Something Other Than `λ`?
-----------------------------------

Yes! Not everyone likes it or wants to type it. Lambda-chop provides aliases
by using a different module to compile your files.

    # Use `fun` instead of `λ`
    sjs -m lambda-chop/macros/fun myfile.js


Available aliases are:
- `fn`
- `fun`
- `func`
- `lam`

***

### Author

Nathan Faubion (@natefaubion)

### License

MIT
