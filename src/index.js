const Plugin = require('./Plugin');

const plugin = ({ types }) => {
  let instance;

  const visitor = {
    Program: {
      enter (_, { opts }) {
        if (!instance) {
          instance = new Plugin(opts, types);
        }
        // console.log(instance.Program)
        // instance.Program.apply(instance, arguments, this);
      },
      exit (_) {
        instance.ProgramExit.apply(instance, arguments, this);
      }
    },
    ImportDeclaration () {
      instance.ImportDeclaration.apply(instance, arguments, this);
    }
  }

  return { visitor };
}



module.exports = plugin;