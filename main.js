'use babel';
var lib = require('./lib');
var fs = require('fs-plus');
import { TextEditor } from 'atom';

export default {

  activate(state) {
    this.view = new GeneratorView();
    this.panel = atom.workspace.addModalPanel({
      item: this.view.element,
      visible: false
    });
    atom.commands.add(
      this.view.element, 'core:confirm', this.confirm.bind(this)
    );
    atom.commands.add(
      this.view.element, 'core:cancel', this.close.bind(this)
    );
    atom.commands.add('atom-workspace', {
      'basic-package-generator:generate-basic-package': () => this.generate()
    });
  },

  generate() {
      this.previouslyFocussedElement = document.activeElement;
      this.panel.show();
      this.view.message.textContent = "Enter package path";
      this.view.miniEditor.setText(this.getPackagesDirectory());
      this.view.miniEditor.element.focus();
  },

  confirm() {
    var directoryPath = this.view.miniEditor.getText().trim();
    var that = this;
    lib.generateSimplePackage(directoryPath, function(err, res){
      if(err) {
        atom.notifications.addError("Error generating simple package. Maybe package already exists. Check console for more info.");
        console.log("Error generating package", err);
        that.close();
      } else {
        atom.notifications.addSuccess("Succesfully generated simple package");
        atom.open({pathsToOpen: [directoryPath]});
        that.close();
      }
    });

  },

  close() {
      if(this.panel.isVisible()) {
      this.panel.hide();
      this.previouslyFocussedElement.focus();
    }
  },

  getPackagesDirectory() {
    return (
      atom.config.get('basic-package-generator.newPackageDirectoryPath') ||
      atom.config.get('core.projectHome') ||
      process.env.ATOM_REPOS_HOME ||
      path.join(fs.getHomeDirectory(), 'github')
    ) + '/';
  },

  deactivate() {
    this.panel.destroy();
  },

  serialize() {
    return {};
  }

};

function GeneratorView() {
    this.element = document.createElement('div');
    this.element.classList.add('basic-package-generator');
    this.miniEditor = new TextEditor({
      mini: true
    });
    this.element.appendChild(this.miniEditor.element);

    this.message = document.createElement('div');
    this.message.classList.add('message')
    this.element.appendChild(this.message)
}
