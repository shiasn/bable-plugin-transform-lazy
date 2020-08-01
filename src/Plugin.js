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

  ProgramExit () {}
}

module.exports = Plugin;
