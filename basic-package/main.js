'use babel';
var lib = require('./lib');


export default {

  activate(state) {
    atom.commands.add('atom-workspace', {
      '{package_name}:toggle': () => console.log(lib.getData())
    });
  },

  deactivate() {
  },

  serialize() {
    return {};
  },

};
