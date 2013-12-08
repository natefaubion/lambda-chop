macro $lc__error {
  case { _ $tok } => {
    throwSyntaxError('lambda-chop', 'Unexpected token', #{ $tok });
  }
}

macro $lc__curry {
  case { _ ( $args ... ) ( $symbol ... ) ( $body ... ) } => {
    var here = #{ here };
    var args = #{ $args ... };
    var symbol = #{ $symbol ... };
    var body = #{ $body ... };

    if (!args.length) {
      args.push(makeDelim('()', []));
    }

    return args.reduceRight(function(bod, alist, i) {
      var func = makeKeyword('function');
      var ret  = i > 0 ? [makeKeyword('return', func)] : [];
      var code = ret.concat(func, alist, makeDelim('{}', bod));

      return symbol[0].token.value === '=>'
        ? code.concat(
            makePunc('.'), 
            makeIdent('bind'), 
            makeDelim('()', [makeKeyword('this')]))
        : code;
    }, body);
  }
}

macro $lc__placeholders {
  case { _ ( $body ... ) } => {
    var here = #{ here };
    var res = makePlaceholders(#{ $body ... });
    return [
      makeKeyword('function'),
      makeDelim('()', res[1], here),
      makeDelim('{}', [makeKeyword('return', res[0][0])].concat(res[0]))
    ];

    function makePlaceholders(stx) {
      var args = [];
      var code = 97;
      return [go(stx), args];

      function go(ss) {
        return ss.map(function(s) {
          if (s.token.type === parser.Token.Punctuator &&
              s.token.value === '#') {
            var ident = makeIdent(String.fromCharCode(code++), here);
            if (args.length) args.push(makePunc(','));
            args.push(ident);
            return ident;
          }
          if (s.token.type === parser.Token.Delimiter) {
            s.expose();
            s.token.inner = go(s.token.inner);
          }
          return s;
        });
      }
    }
  }
}

macro $lc__args {
  rule { ( $prev ... ) $name:ident } => {
    $lc__args ( $prev ... ( $name ) )
  }
  rule { ( $prev ... ) ( $name:ident (,) ... ) } => {
    $lc__args ( $prev ... ( $name (,) ... ) )
  }
  rule { ( $prev ... ) => { $body ... } } => {
    $lc__curry ( $prev ... ) ( => ) ( $body ... )
  }
  rule { ( $prev ... ) -> { $body ... } } => {
    $lc__curry ( $prev ... ) ( -> ) ( $body ... )
  }
  rule { ( $prev ... ) => $body:expr } => {
    $lc__curry ( $prev ... ) ( => ) ( return $body )
  }
  rule { ( $prev ... ) -> $body:expr } => {
    $lc__curry ( $prev ... ) ( -> ) ( return $body )
  }
  rule { $tok } => {
    $lc__error $tok
  }
}

macro lam {
  rule { [ $body ... ] } => {
    $lc__placeholders ( $body ... )
  }
  rule {} => {
    $lc__args ()
  }
}

export lam;
