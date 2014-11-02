P = require('bluebird')
a = require('chai').assert

P.longStackTraces()

GLOBAL.Promise = require('bluebird')
GLOBAL.a = a
GLOBAL.eq = a.deepEqual
GLOBAL.fs = require('../lib/utils').fs
GLOBAL.cproc = require('../lib/utils').cproc
GLOBAL.I = require('immutable')
GLOBAL.List = GLOBAL.I.List
GLOBAL.Map = GLOBAL.I.Map
GLOBAL.Set = GLOBAL.I.Set
