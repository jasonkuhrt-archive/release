pr = require('bluebird')
im = require('immutable')
a = require('chai').assert

pr.longStackTraces()

GLOBAL.Promise = pr
GLOBAL.a = a
GLOBAL.eq = a.deepEqual
GLOBAL.fs = require('../lib/utils').fs
GLOBAL.cproc = require('../lib/utils').cproc
GLOBAL.Immutable = im
GLOBAL.I = im
GLOBAL.List = GLOBAL.I.List
GLOBAL.Map = GLOBAL.I.Map
GLOBAL.Set = GLOBAL.I.Set
