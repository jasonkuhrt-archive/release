'use strict';



var p = require('commander');
var fs = require('fs');
var path = require('path');
var semver = require('semver');
var cproc = require('child_process');
var format = require('util').format;
var async = require('async');


p
  .version(require('../package.json').version)
  .option('-y, --no-prompt', 'Disable confirmation prompt')
  .option('--no-publish', 'Disable registry publishing')
  .option('-p, --patch', 'Make a patch release')
  .option('-m, --minor', 'Make a minor release')
  .option('-M, --major', 'Make a major release')
  ;

p.parse(process.argv);



function do_release(){
  var rel_type = get_chosen_rel_type(p);
  async.series([
    update_manifest_file.bind(null, rel_type),
    update_git_repo.bind(null, rel_type),
    // update_package_registry
  ], function(err){
    console.log(err);
  });
}


function update_package_registry(cb){
  cproc.exec('npm publish', cb);
}

function update_git_repo(release_type, cb){
  var v = get_current_version();
  async.series([
    cproc.exec.bind(null, 'git add package.json'),
    cproc.exec.bind(null, 'git commit -m "'+ commit_message(release_type, v) +'"'),
    cproc.exec.bind(null, 'git tag '+ v),
    cproc.exec.bind(null, 'git push'),
    cproc.exec.bind(null, 'git push --tags')
  ], cb);
}

function commit_message(release_type, version){
  return format('Release %s %s', release_type, version);
}

function get_current_version(){
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'))).version;
}

function update_manifest_file(release_type, cb){
  getManifestFile(function(err, manifest_file){
    if (err) return cb(err);

    var v = manifest_file.version;
    var v_ = semver.inc(v, release_type);
    manifest_file.version = v_;
    var manifest_file_ = JSON.stringify(manifest_file, null, 2);

    fs.writeFile(path.join(process.cwd(), 'package.json'), manifest_file_, cb);
  });
}


function get_chosen_rel_type(prog){
  var types = ['patch', 'minor', 'major'];
  for (var i = 0; i < types.length; i++) {
    if (prog[types[i]]) return types[i];
  }
}


function getManifestFile(cb){
  fs.readFile(path.join(process.cwd(), 'package.json'), function(err, data){
    if (err) return cb(err);
    cb(null, JSON.parse(data));
  });
}

do_release();