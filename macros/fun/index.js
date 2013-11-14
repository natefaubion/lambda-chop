macro $lambda_chop__curry {
  case { _ ( $names ... ) ( $symbol ... ) ( $body ... ) } => {
    var here = #{ here };
    var names = #{ $names ... };
    var symbol = #{ $symbol ... };
    var body = #{ $body ... };

    return names.reduceRight(function(bod, name, i) {
      var func = makeKeyword('function');
      var ret = i > 0 ? [makeKeyword('return', func)] : [];
      var code = ret.concat(
        func, 
        makeDelim('()', [name]),
        makeDelim('{}', bod));

      return symbol[0].token.value === '='
        ? code.concat(
            makePunc('.'), 
            makeIdent('bind'), 
            makeDelim('()', [makeKeyword('this')]))
        : code;
    }, body);
  }
}

macro fun {
  case { _ [ $body ... ] } => {
    var res = makePlaceholders(#{ $body ... });
    return [
      makeKeyword('function'),
      makeDelim('()', res[1]),
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
            var ident = makeIdent(String.fromCharCode(code++));
            if (args.length) args.push(makePunc(','));
            args.push(ident);
            return ident;
          }
          if (s.token.type === parser.Token.Delimiter) {
            s.token.inner = go(s.token.inner);
          }
          return s;
        });
      }
    }
  }
  case { _ => { $body ...} } => {
    return #{ function () { $body ...  }.bind(this) };
  }
  case { _ => $body:expr } => {
    return #{ function () { return $body  }.bind(this) };
  }
  case { _ -> { $body ...} } => {
    return #{ function () { $body ...  } };
  }
  case { _ -> $body:expr } => {
    return #{ function () { return $body; } };
  }
  case { _ ( $name:ident (,) ... ) => { $body ...} } => {
    return #{ function ($name (,) ...) { $body ...  }.bind(this) };
  }
  case { _ ( $name:ident (,) ... ) => $body:expr } => {
    return #{ function ($name (,) ...) { return $body; }.bind(this) };
  }
  case { _ ( $name:ident (,) ... ) -> { $body ...} } => {
    return #{ function ($name (,) ...) { $body ...  } };
  }
  case { _ ( $name:ident (,) ... ) -> $body:expr } => {
    return #{ function ($name (,) ...) { return $body; } };
  }
  case { _ $name:ident ... => { $body ... } } => {
    return #{ $lambda_chop__curry ($name ...) (=>) ($body ...) };
  }
  case { _ $name:ident ... => $body:expr } => {
    return #{ $lambda_chop__curry ($name ...) (=>) (return $body) };
  }
  case { _ $name:ident ... -> { $body ... } } => {
    return #{ $lambda_chop__curry ($name ...) (->) ($body ...) };
  }
  case { _ $name:ident ... -> $body:expr } => {
    return #{ $lambda_chop__curry ($name ...) (->) (return $body) };
  }
}
