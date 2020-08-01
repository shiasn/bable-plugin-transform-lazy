const DEFAULT_SPECIFIER_FLAG = 'ImportDefaultSpecifier';
const REACT_FLAG = 'react';

class Plugin {
  constructor (options, types) {
    this.t = types;
    this.options = options;
    this.lazyDetected = false;
    this.lazyComponentDetected = false;
  }

  ImportDeclaration (options) {
    const { node } = options;
    const { source } = node;

    if (!source || !source.extra) return;

    const extra = source.extra.rawValue;
    const specifier = node.specifiers.find(({ type }) => type === DEFAULT_SPECIFIER_FLAG);

    if (!specifier) return;

    this.lazyComponentDetected = true;

    const local = specifier.local.name;

    if (!this.check(local, extra)) {
      this.detectLazyFlag(extra);
      return;
    }

    this.replaceToLazy(options, local, extra)
  }

  check (local, extra) {
    const { checker } = this.options;
    if (!checker) return true;
    return checker(local, extra);
  }

  detectLazyFlag (extra) {
    if (this.lazyDetected || extra !== REACT_FLAG) return;

    this.lazyDetected = node.specifiers.some(s => s.imported && s.imported.name === 'lazy');
  }

  replaceToLazy (options, local, extra) {
    const t = this.t;
  
    const importCallback = t.arrowFunctionExpression(
      [],
      t.CallExpression(
        t.Identifier('import'),
        [
          t.StringLiteral(extra)
        ]
      )
    );
  
    options.replaceWith(
      t.variableDeclaration('const', [
        t.variableDeclarator(
          t.Identifier(local),
          t.CallExpression(
            t.Identifier('lazy'),
            [importCallback]
          )
        )
      ])
    );
  }

  ProgramExit () {}
}

module.exports = Plugin;
