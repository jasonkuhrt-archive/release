var debug = require('debug')('release-core')
var im = require('immutable')
var pr = require('bluebird')



module.exports = function ReleaseWrapper(){
  return Release()
}

module.exports.Release = Release
module.exports.use = use
module.exports.scan = scan



// Methods

function Release(existingState){
  var state = existingState || im.fromJS({ plugins: [] })

  state.use = function(plugin){
    return Release(use(state, plugin))
  }

  state.scan = function(){
    return Release(scan(state))
  }

  return state
}



// Functions

function use(release, plugin){
  return release.update('plugins', function updater(plugins){
    return plugins.push(plugin)
  })
}

function scan(release){
  var scanning = release.get('plugins').map(_pluginScan)
  return pr.all(scanning.toJS())
  .then(_organizeScansData.bind(null, release))
}

function _pluginScan(plugin){
  debug('plugin %s scanning started', plugin.name)
  return pr
  .resolve(plugin.scan())
  .tap(function(scanData){ debug('plugin %s scanning done: %s', scanData) })
  .then(_labelScanData.bind(null, plugin.name))
}

function _labelScanData(pluginName, scanData){
  return im.fromJS({ name: pluginName, data: scanData })
}

function _organizeScansData(release, scansArray){
  return release.update('scans', function(){
    return scansArray.reduce(function(scansMap, scan){
      return scansMap.set(scan.get('name'), scan.get('data'))
    }, im.Map())
  })
}

/*
Release Execution

Release executes in two phases.

1. A scanning phase
2. An execution phase

Scanning phase

Each plugin defines its own scanning function. This function
tests its environment to decide whether it should be used.

If the plugin decides it should be used then it returns positive,
otherwise, it returns negative including a descriptive reason.
The release instance stores the scan results namespaced under
the plugin's name.

After each plugin has scanned in parallel, each possibly returning a Promise,
the scanning phase is complete.

Execution phase

Each pluging that returned negative scan results is now ignored.

An assembly line is created integrating each plugins' steps. Each plugin step
specifies its placement (when) and its function (what).

With an organized assembly line, actions execute in series, each possibly
returning a Promise. Each action is given an argument of the release state
which includes all data gathered by all plugins during the scanning phase.
*/
