# release
Joyful lightening-fast project releases



## Installation

    npm install --global release2

(`release` was already taken)


## Features

- Currently supports: Node projects being version-controlled by git

#### Example:

![deploy-screenshot](https://raw.githubusercontent.com/jasonkuhrt/release/gh-pages/deploy-screenshot.png)

```sh
About to make a patch release that will result in version: 0.1.7
prompt: Confirm this release (y|yes):  y

✓ done: git commit
✓ done: git push
✓ done: npm publish

Version 0.1.7 successfully released!
```



## Roadmap
This project is being worked on. What follows is a spec of what the project will become.

#### Why

Humans should be able to confidently release project iterations using one familiar interface regardless of their version-control or packaging system of choice.

While `release` is created upon the [nodejs](http://nodejs.org) platform its system-agnostic goals may be ported to a more neutral platform in the future (e.g. `shell scripts`). `node` was chosen because it is currently the author's most proficient environment but also because `node` has a vibrant full-stack community using multiple packaging systems, and a unix-like mentality of authoring many small focused modules; this is fertil soil to plant `release`.

#### How

`release` uses drivers to support many version-control and packaging systems. More can be added via cli plugins.

`release` decides upon the systems in use by detecting key files and folders in `cwd`. For instance given a `cwd` containing

    .git/
    package.json
    component.json

`release` will decide that:

- version-control system [git](http://www.git-scm.org) is being used.
- packaging system [npmjs](https://www.npmjs.org) is being used.
- packaging system [componentjs](http://component.io) is being used.

Then `release` employs the respective drivers for each system bridging their disparate interfaces to `release`'s.

Defaults can be customized in `.release.(yml|json)` which will be searched for in `cwd`, then recursively until `/`. Config files closer to `cwd` override ones further away. CLI-flags will override config file defaults.

#### What

    - hook: pre: release

    - hook: pre: validate
      - validate: version numbers' correctness
      - validate: manifest files' correctness
      - validate: version-control system in correct state
    - hook: post: validate

    - hook: pre: increment
      - increment: versison numbers in package system manifest files
    - hook: post: increment

    - hook: pre: commit
      - commit manifest file(s)
      - tag commit node with version
    - hook: post: commit

    - hook: pre: push
      - push to remote origin
    - hook: post: push

    - hook: pre: publish
      - publish to applicable package registr(y|ies)
    - hook: post: publish

    - hook: post: release

Things it does well:
  - Use `semvar`
  - Update Manifest files:
    - `component`'s `component.json`
    - `npm`'s `package.json`
    - `bower`'s `bower.json`
  - Registry publishing
  - VCS commit:
    - `git`
  - Extendable

Things it could do well (ideas):
  - Summarize release changes in a changelog `hook:post:increment`
  - ... please fork and contribute
