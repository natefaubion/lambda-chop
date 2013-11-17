var assert = require('chai').assert;

describe 'Lambdas' {
  var ctx = {
    foo: 42
  };

  it 'should allow no arguments' {
    var a = λ -> 42;
    var b = (λ -> λ => this.foo).call(ctx);

    test 'unbound' { a() === 42 }
    test 'bound'   { b() === 42 }
  }

  it 'should allow one argument without parens' {
    var a = λ x -> x;
    var b = (λ -> λ x => this.foo + 1).call(ctx);
    var c = (λ -> λ x => this.foo + 1;).call(ctx);

    test 'unbound' { a(1) === 1 }
    test 'bound'   { b(1) === 43 }
    test 'bound with ;'   { c(1) === 43 }
  }


  it 'should curry multiple arguments' {
    var a = λ x y -> x + y;
    var b = (λ -> λ x y => this.foo + x - y).call(ctx);

    test 'unbound' { a(1)(2) === 3 }
    test 'bound'   { b(1)(2) === 41 }
  }

  it 'should allow tupled args' {
    var a = λ(x, y) -> x + y;
    var b = (λ -> λ(x, y) => this.foo + x - y).call(ctx);

    test 'unbound' { a(1, 2) === 3 }
    test 'bound'   { b(1, 2) === 41 }
  }

  it 'should allow multiple arg lists' {
    var a = λ(s, t)(x, y) -> s * t - x * y
    var b = (λ -> λ(s, t)(x, y) => this.foo - s * t - x* y).call(ctx)

    test 'unbound' { a(3, 5)(2, 4) === 7 }
    test 'bound'   { b(3, 5)(2, 4) === 19 }
  }

  it 'should allow partials with placeholders' {
    var a = λ[# + #];

    test 'unbound' { a(1, 2) === 3 }
  }

  it 'should not auto return when using a block' {
    var a = λ -> { 12 }
    var b = λ -> { return 12 }

    test 'no return' { a() === void 0 }
    test 'return'    { b() === 12 }
  }
}
