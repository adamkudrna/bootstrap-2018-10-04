const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const cssClean = require('gulp-clean-css');
const concat = require('gulp-concat');
const del = require('del');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const header = require('gulp-header');
const imagemin = require('gulp-imagemin');
const sass = require('gulp-sass');
const svgSprites = require('gulp-svg-sprites');
const stylelint = require('gulp-stylelint');
const uglify = require('gulp-uglify');

const DEV_URL = 'localhost:8000';

const DEST_DIR = 'web';
const NPM_DIR = 'node_modules';
const SRC_DIR = 'resources';
const VIEWS_DIR = 'web';

const JS_CONCAT_FILES = [
  `${NPM_DIR}/jquery/dist/jquery.min.js`,
  `${NPM_DIR}/popper.js/dist/umd/popper.min.js`,
  `${NPM_DIR}/bootstrap/dist/js/bootstrap.min.js`,
  `${DEST_DIR}/js/main.min.js`,
];

const BANNER_SVG_SPRITES = '<!-- ⚠️ WARNING: THIS FILE IS GENERATED BY `$ gulp make-svg-sprites`. DO NOT EDIT MANUALLY. -->\n\n';

function reload(done) {
  browserSync.reload();
  done();
}

function cleanCSS() {
  return del(`${DEST_DIR}/css`);
}

function lintCSS() {
  return gulp
    .src([`${SRC_DIR}/scss/**/*.scss`])
    .pipe(stylelint({
      reporters: [
        {
          console: true,
          formatter: 'string',
        },
      ],
    }));
}

function buildCSS() {
  return gulp
    .src([`${SRC_DIR}/scss/main.scss`])
    .pipe(sass({
      paths: [
        NPM_DIR,
      ],
    }))
    .pipe(autoprefixer())
    .pipe(concat('main.css'))
    .pipe(gulp.dest(`${DEST_DIR}/css`));
}

function minifyCSS() {
  return gulp
    .src(`${DEST_DIR}/css/main.css`)
    .pipe(cssClean())
    .pipe(concat('main.min.css'))
    .pipe(gulp.dest(`${DEST_DIR}/css`))
    .pipe(browserSync.stream());
}

function cleanImages() {
  return del(`${DEST_DIR}/images`);
}

function buildImages() {
  return gulp
    .src(`${SRC_DIR}/images/**`)
    .pipe(imagemin([
      imagemin.jpegtran({ progressive: true }),
    ]))
    .pipe(gulp.dest(`${DEST_DIR}/images`));
}

function cleanJS() {
  return del(`${DEST_DIR}/js`);
}

function lintJS() {
  return gulp
    .src([
      '*.js',
      `${SRC_DIR}/js/**/*.js`,
    ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
}

function minifyJS() {
  return gulp
    .src(`${SRC_DIR}/js/**/*.js`)
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(`${DEST_DIR}/js`));
}

function concatJS() {
  return gulp
    .src(JS_CONCAT_FILES)
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(`${DEST_DIR}/js`));
}

function makeSvgSprites() {
  return gulp
    .src(`${SRC_DIR}/svg/*.svg`)
    .pipe(svgSprites({
      mode: 'symbols',
      preview: false,
      svg: {
        symbols: 'symbols.svg',
      },
      svgId: 'symbol-%f',
    }))
    .pipe(header(BANNER_SVG_SPRITES))
    .pipe(gulp.dest(`${VIEWS_DIR}/svg`));
}

function watchCSS() {
  gulp
    .watch(`${SRC_DIR}/scss/**/*.scss`, gulp.parallel('lint-css', 'build-css'));
}

function watchImages() {
  gulp
    .watch(`${SRC_DIR}/images/**`, gulp.series('build-images', reload));
}

function watchJS() {
  gulp
    .watch(`${SRC_DIR}/js/**/*.js`, gulp.series(gulp.parallel('lint-js', 'build-js'), reload));
}

function watchViews() {
  gulp
    .watch(`${VIEWS_DIR}/*.html`, gulp.series(reload));
}

function runBrowserSync(done) {
  browserSync.init({
    open: false,
    proxy: DEV_URL,
  }, done);
}

// Build tasks
gulp.task('clean', gulp.parallel(
  cleanCSS,
  cleanImages,
  cleanJS,
));
gulp.task('lint-css', lintCSS);
gulp.task('build-css', gulp.series(buildCSS, minifyCSS));
gulp.task('lint-js', lintJS);
gulp.task('build-js', gulp.series(minifyJS, concatJS));
gulp.task('build-images', buildImages);

gulp.task('default', gulp.series('clean', gulp.parallel(
  gulp.series('lint-css', 'build-css'),
  gulp.series('lint-js', 'build-js'),
  'build-images',
)));

// Development tasks
gulp.task('make-svg-sprites', makeSvgSprites);
gulp.task('watch', gulp.parallel(watchCSS, watchImages, watchJS, watchViews));
gulp.task('serve', gulp.series('default', runBrowserSync, 'watch'));
