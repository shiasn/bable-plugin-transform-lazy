const DEFAULT_SPECIFIER_FLAG = 'ImportDefaultSpecifier';

class Plugin {
  constructor (options, types) {
    this.t = types;
    this.options = options;
    this.lazyDetected = false;
  }

  ImportDeclaration (options) {
    const { node } = options;
    const { source } = node;

    if (!source || !source.extra) return;

    const extra = source.extra.rawValue;
    const specifier = node.specifiers.find(({ type }) => type === DEFAULT_SPECIFIER_FLAG);

    if (!specifier) return;

    const local = specifier.local.name;

    if (!this.check(local, extra)) {

    }
  }

  check (local, extra) {
    const { checker } = this.options;
    if (!checker) return true;
    return checker(local, extra);
  }

  ProgramExit () {}
}

module.exports = Plugin;
