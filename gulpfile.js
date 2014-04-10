var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  styl = require('gulp-stylus'),
  nodemon = require('gulp-nodemon'),
  include = require('gulp-include'),
  livereload = require('gulp-livereload'),
  prefix = require('gulp-autoprefixer'),
  bower = require("gulp-bower-files"),

  _ = {
    public: './public/',
    css: './public/css/',
    styl: './public/styl/',
    js: './public/js/',
    pages: './pages/'
  }

gulp.task('default', ['run', 'watch'])

gulp.task('run', function(cb) {
  nodemon({
    script: 'app.js',
    ext: 'js',
    ignore: ['/public/*', '/pages/*']
  })
})


gulp.task('watch', function(cb) {
  var server = livereload()
  function change(file) {
    server.changed(file.path);
  }

  gulp.watch(_.styl + '**/*.styl', ['styl'])
  gulp.watch(_.js + '**').on('change', change)
  gulp.watch(_.pages + '**').on('change', change)
})

gulp.task('styl', function() {
  gulp.src( _.styl + '**/*.styl')
    .pipe(include())
    .pipe(styl({
      use: ['nib'],
      paths: [ _.styl ],
      import: ['nib']
    }))
    .pipe(prefix.apply(prefix, [ "last 2 versions"]))
    .pipe(gulp.dest( _.css ))
    .pipe(livereload())
})

gulp.task('vendor', function() {
  bower()
    .pipe(gulp.dest( _.build ))
})

gulp.task('build', function () {
    console.log('gulp build task')
})
