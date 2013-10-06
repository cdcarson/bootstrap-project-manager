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

### init

```
$ grunt init:foobar
```

This command initializes a new project. It:

 - Creates the `bootstrap-roject-manger/projects` folder if one does not exist (i.e. this is your first project.) This folder is `.gitignore`'d, and is where your projects are stored. 
 - Under that directory, it creates the project folder named with what you provided to the command, in this case `foobar`.
 - Copies the Bootstrap fonts from `boostrap/fonts` into `foobar/assets/fonts`. See [update-fonts](#update-fonts).
 - Concats and minifies the js `boostrap/js` into `foobar/assets/js`. See [update-bootstrap-js](#update-bootstrap-js)
 - Creates `less/style.less`. This file contains one line: `@import "../../../bootstrap/less/bootstrap";`. That file is compiled and minified. See [update-css](#update-css)

The file layout:

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



 

### update-fonts

```
$ grunt update-fonts:foobar
```

 - Freshly copies the Bootstrap fonts from `bootstrap/fonts` to `foobar/assets/fonts`. Note that other font files and directories in `foobar/assets/fonts` are **not overwritten**.
 - For each target you've defined:
   - Cleans the `target/assets/fonts` directory with `clean`. This means that fonts you've added to the target without adding them to `foobar/assets/fonts` **will be deleted**.
   - Copies everything from `foobar/assets/fonts` to `target/assets/fonts`
   
### update-bootstrap-js

```
$ grunt update-bootstrap-js:foobar
```
 - Creates fresh copies of `bootstrap.js` and `bootstrap.min.js` in `foobar/assets/js` from the bootstrap source code using `concat` and `uglify`. Note that other js files and directories in `foobar/assets/js` are **not overwritten**.
 - For each target you've defined:
    - Cleans the `target/assets/js` directory with `clean`. This means that anything you've added to the target without adding them to `foobar/assets/js` **will be deleted**.
   - Copies everything from `foobar/assets/js` to `target/assets/js`

### update-css

```
$ grunt update-css:foobar
```

 - Compiles `less/style.less` into `foobar/assets/css/style.css` and `foobar/assets/css/style.min.css` using `recess`. Note that other css files and directories in `foobar/assets/css` are **not overwritten**.
- The `less/` directory is where you'll make your style changes.  All the files in this directory are watched by the `watcher` command below; but only `less/style.less` is compiled  That means that you have to `@import` the LESS files you want into `style.less`.
- For each target you've defined:
    - Cleans the `target/assets/css` directory with `clean`. This means that anything you've added to the target without adding them to `foobar/assets/css` **will be deleted**.
   - Copies everything from `foobar/assets/css` to `target/assets/css`


### watch-css

```
$ grunt watch-css:foobar
```







