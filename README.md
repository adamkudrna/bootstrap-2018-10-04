# Bootstrap 4 Dev Stack Demo

## Build
Front-end assets are built with [Gulp 4](https://gulpjs.com) task runner.

Requirements:

- [Node 8 LTS](https://nodejs.org/en/)
- [gulp-cli](https://www.npmjs.com/package/gulp-cli)

Use `$ sh ./build.sh` to build all templates and front-end assets.

## Front-End Resources

All front-end assets are placed in `resources` directory:

```
- resources
  - images
  - js
  - scss
  - svg
```

### Images
Images are optimized to save data during load. Progressive JPEG is used to improve perceived loading
speed. 

### CSS
CSS source is written in [SCSS](https://sass-lang.com/) according to Bootstrap naming conventions.

### JS
JavaScript is written in ES 6. Custom JS is concatenated with jQuery, Popper.js and Bootstrap JS and
served as a single file.

### SVG
SVG symbols are created from individual SVG files. Use `$ gulp make-svg-sprites` to update actual
SVG output used in templates.

## Development
1. Run a web server in `web` directory, eg. `$ php -S 0.0.0.0:8000`. Content of `web` directory is
   now served at `http://localhost:8000`. 
2. In the project root directory, run `$ gulp serve`. This:
   1. builds templates and front-end assets
   2. starts watching over source files in `resources` and HTML files for changes to run appropriate
      Gulp tasks
   3. starts [BrowserSync](https://browsersync.io) at `http://localhost:3000`
