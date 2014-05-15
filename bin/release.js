'use strict';



var p = require('commander');
var fs = require('fs');
var path = require('path');
var semver = require('semver');


p
  .version(require('../package.json').version)
  .option('-y, --no-prompt', 'Do not prompt for confirmation')
  .option('-p, --patch', 'Make a patch release')
  .option('-m, --minor', 'Make a minor release')
  .option('-M, --major', 'Make a major release')
  ;

p.parse(process.argv);



function do_release(){
  var rel_type = get_chosen_rel_type(p);
  update_manifest_file(rel_type);
}



function update_manifest_file(release_type){
  var manifest_file = getManifestFile();

  var v = manifest_file.version;
  var v_ = semver.inc(v, release_type);

  manifest_file.version = v_;
  var manifest_file_ = JSON.stringify(manifest_file, null, 2);

  fs.writeFileSync(path.join(process.cwd(), 'package.json'), manifest_file_);
}


function get_chosen_rel_type(prog){
  var types = ['patch', 'minor', 'major'];
  for (var i = 0; i < types.length; i++) {
    if (prog[types[i]]) return types[i];
  }
}


function getManifestFile(){
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json')));
}

do_release();