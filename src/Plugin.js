const DEFAULT_SPECIFIER_FLAG = 'ImportDefaultSpecifier';
const REACT_FLAG = 'react';

class Plugin {
  constructor (options, types) {
    this.t = types;
    this.options = options;
    this.lazyDetected = false;
    this.lazyComponentDetected = false;
    this.reactImportDeclarationOptions = null;
  }

  ImportDeclaration (options) {
    const { node } = options;
    const { source } = node;

    if (!source || !source.extra) return;

    const extra = source.extra.rawValue;
    const specifiers = node.specifiers;
    const specifier = specifiers.find(({ type }) => type === DEFAULT_SPECIFIER_FLAG);

    if (!specifier) return;

    this.lazyComponentDetected = true;

    const local = specifier.local.name;

    if (!this.check(local, extra)) {
      if (!this.lazyDetected || extra === REACT_FLAG) {
        this.lazyDetected = specifiers.some(s => s.imported && s.imported.name === 'lazy');
      }

      if (extra === REACT_FLAG) {
        this.reactImportDeclarationOptions = options;
      }

      return;
    }

    this.replaceToLazy(options, local, extra)
  }

  check (local, extra) {
    const { checker } = this.options;
    if (!checker) return true;
    return checker(local, extra);
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

  addLazyFlag (node) {
    if (!this.lazyComponentDetected) return;
    if (this.lazyDetected) return;

    const t = this.t;

    if (this.reactImportDeclarationOptions) {
      const importDeclarationNode = {...this.reactImportDeclarationOptions.node};
      importDeclarationNode.specifiers = [
        ...importDeclarationNode.specifiers,
        t.ImportSpecifier(
          t.Identifier('lazy'),
          t.Identifier('lazy')
        )
      ]
  
      this.reactImportDeclarationOptions.replaceWith(importDeclarationNode);
      return;
    }

    node.body.unshift(t.ImportDeclaration(
      [
        t.ImportSpecifier(
          t.Identifier('lazy'),
          t.Identifier('lazy')
        ),
      ],
      t.StringLiteral('react')
    ));
  }

  ProgramExit ({ node }) {
    this.addLazyFlag(node);

    this.lazyDetected = false;
    this.lazyComponentDetected = false;
    this.reactImportDeclarationOptions = null;
  }
}

module.exports = Plugin;
