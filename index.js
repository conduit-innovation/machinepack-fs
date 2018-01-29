// Transform for webpack
var pkg = require('./package.json');
var newMachines = [];

for (var i in pkg.machinepack.machines) {

  var id = pkg.machinepack.machines[i];

  newMachines.push({
    id: id,
    def: require('./machines/' + id + '.js')
  });
}

pkg.machinepack.machines = newMachines;

module.exports = require('machine').pack({
  pkg: pkg,
  dir: __dirname
});
