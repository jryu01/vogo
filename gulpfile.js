'use strict';
/*jshint node: true */

var _ = require('lodash'),
    fs = require('fs'),
    sh = require('shelljs'),
    argv = require('yargs').argv,
    sass = require('gulp-sass'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    shell = require('gulp-shell'),
    bower = require('bower'),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename'),
    inject = require('gulp-inject'),
    stylish = require('jshint-stylish'),
    minifyCss = require('gulp-minify-css'),
    // concat = require('gulp-concat'),
    runSequence = require('run-sequence');

var paths = {
  sass: ['./www/app/**/*.scss'],
  scripts: {
    app: ['./www/app/**/*.js', '!./www/app/**/*.spec.js']
  }
};
var configure = function (env) {
  var config = require('./www/app/config.json'),
      configObj,
      newFile,
      compiled;

  env = env || (argv.production && 'production') || (argv.test && 'test');

  compiled = _.template(
    '\'use strict\';\n' +
    '/* jshint quotmark: false */\n\n' +
    'angular.module(\'<%= moduleName %>\', [])\n\n' +
    '.constant(\'config\', <%= config %>);'
  );
  configObj = _.merge(config.common, config[env ||'development']);
  newFile = compiled({
    'config': JSON.stringify(configObj, null, 2),
    'moduleName': config.configModuleName
  });
  
  fs.writeFileSync('./www/app/components/config/config.js', newFile);
  gutil.log('Running  \'' + 
    gutil.colors.cyan('config') +'\' with ' + 
    gutil.colors.magenta(env || 'development')
    );
};

gulp.task('default',['build']);

gulp.task('build', function (done) {
  runSequence('config', ['sass', 'index'], 'lint', done);
});

gulp.task('pkgandroid', function () {
  configure((argv.test && 'test') || 'production');
  return runSequence('pkgandroidapp');
});
gulp.task('pkgandroidapp', shell.task([
  'rm -f VoteIt-*.apk',
  'cordova build --release android',
  'jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore voteit-release-key.keystore platforms/android/build/outputs/apk/android-x86-release-unsigned.apk voteit -storepass voteit2015',
  'jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore voteit-release-key.keystore platforms/android/build/outputs/apk/android-armv7-release-unsigned.apk voteit -storepass voteit2015',
  'zipalign -v 4 platforms/android/build/outputs/apk/android-x86-release-unsigned.apk VoteIt-x86.apk',
  'zipalign -v 4 platforms/android/build/outputs/apk/android-armv7-release-unsigned.apk VoteIt-armv7.apk'
]));

gulp.task('config', function () {
  configure();
});

gulp.task('sass', function () {
  return gulp.src('./www/app/*.scss')
    .pipe(sass({errLogToConsole: true}))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'));
});

gulp.task('index', function () {
  var target = gulp.src('./www/index.html'),
      sources = gulp.src(paths.scripts.app, { read: false });
  return target
    .pipe(inject(sources, { relative: true }))
    .pipe(gulp.dest('./www'));
});

gulp.task('lint', function() {
  return gulp.src('./www/app/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('watch', function () {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.scripts.app, ['index', 'lint']);
});

gulp.task('install', function (done) {
  runSequence('ionic-check', 'bower-install', 'build', done);
});

gulp.task('bower-install', function () {
  return bower.commands.install()
    .on('log', function (data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('ionic-check', function (done) {
  if (!sh.which('ionic') || !sh.which('cordova')) {
    console.log(
      '  ' + gutil.colors.red('Ionic or Cordova is not installed.'),
      '\n  Ionic and Cordova is required to build',
      '\n  Install Ionic and cordova: ',
      gutil.colors.cyan('npm install -g cordova ionic'),
      '\n  Once installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
