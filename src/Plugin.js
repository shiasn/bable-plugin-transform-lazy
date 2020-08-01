class Plugin {
  constructor (options, types) {
    this.t = types;
    this.options = options;
    this.lazyDetected = false;
  }

  ImportDeclaration (options) {}

  ProgramExit () {}
}

module.exports = Plugin;
