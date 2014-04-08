var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  styl = require('gulp-stylus'),
  watch = require('gulp-watch'),
  include = require('gulp-include'),
  prefix = require('gulp-autoprefixer'),
  bower = require("gulp-bower-files"),

  _ = {
    public: './public/',
    css: './public/css/',
    styl: './public/styl/'
  }

gulp.task('default', ['styl', 'watch'])

gulp.task('watch', function(cb) {
  gulp.watch(_.styl + '*.styl', ['styl'])
})

gulp.task('styl', function() {
  gulp.src( _.styl + '*.styl')
    .pipe(include())
    .pipe(styl({
      use: ['nib'],
      paths: [ _.styl ],
      import: ['nib']
    }))
    .pipe(prefix.apply(prefix, [ "last 2 versions"]))
    .pipe(gulp.dest( _.css ))
})


gulp.task('js', function() {
  gulp.src( _.public + '/js/**')
    .pipe(include())
    .pipe(uglify())
    .pipe(concat('all.min.js'))
    .pipe(gulp.dest( _.build ))
})

gulp.task('vendor', function() {
  bower()
    .pipe(gulp.dest( _.build ))
})

gulp.task('build', function () {
    console.log('gulp build task')
})
