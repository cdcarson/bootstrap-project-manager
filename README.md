# Bootstrap Project Manager

Use Bootstrap Project Manager to manage multiple [Twitter Bootstrap](https://github.com/twbs/bootstrap) projects without having to maintain multiple versions of Bootstrap.

## Installation

If you gon't already have Grunt installed, do this. 

```
$ npm install -g grunt-cli
```

Clone Bootstrap Project Manager.

```
$ git clone https://github.com/cdcarson/bootstrap-project-manager.git
``` 

Change into the directory.

```
$ cd bootstrap-project-manager
```

Initialize and update the Bootstrap submodule.

```
$ git submodule init
```

```
$ git submodule update
```

Install the dependencies.

```
$ npm install
```

## Available Grunt Commands

All commands take the the following form:

```
$ grunt <command>:<project-name>
```

### Initialize a project

```
$ grunt init:foobar
```

This creates the following directories and files:

```
- bootstrap-project-manager
  - projects
    - foobar
      - assets
        - css
          - style.css
          - style.min.css
        - fonts
          - glyphicons-halflings-regular.eot	
          - glyphicons-halflings-regular.svg
          - glyphicons-halflings-regular.ttf
          - glyphicons-halflings-regular.woff
        - js
          - bootstrap.js
          - bootstrap.min.js
      - less
        - style.less
      - project.json
```

`grunt init:foobar` does the following:

 - Creates the `projects` folder if one does not exist (i.e. this is your first project.) This folder is `.gitignore`'d, and is where your projects are stored by default. 
 - Creates the project folder named with the project name you provided to the command, in this case `foobar`.
 - Copies the Bootstrap fonts from `boostrap/fonts` into `foobar/assets/fonts`.
 - Concats and minifies the js `boostrap/js` into `foobar/assets/js`
 - Creates `less/style.less`. This file contains one line: `@import "../../../bootstrap/less/bootstrap";`. 
 


### Compile a project's LESS

```
$ grunt compile:foobar
```

 - Compiles `less/style.less` into `assets/css/style.css` and `assets/css/style.min.css` using `recess`.
- The `less/` directory is where you'll make your style changes.  All the files in this directory are watched by the `watcher` command below; but only `less/style.less` is compiled  That means that you have to `@import` the LESS files you want into `style.less`.


### Watch








