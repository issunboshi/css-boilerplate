// ==========================================================================
// # DEPENDENCIES
// ==========================================================================

var gulp = require('gulp'),
gulpLoadPlugins = require('gulp-load-plugins');

plugins = gulpLoadPlugins();

plugins.prefix = require('gulp-autoprefixer');
plugins.postcss = require('gulp-postcss');
plugins.pixrem = require('pixrem');
plugins.csswring = require('csswring');
plugins.mqpacker = require('css-mqpacker');
plugins.sass = require("gulp-sass");
plugins.scsslint = require('gulp-scss-lint');
plugins.sourcemaps = require("gulp-sourcemaps");

plugins.inject = require('gulp-inject');

// ==========================================================================
// # CONSTANTS
// ==========================================================================

var basePath    = "./";

cssSrcDir       = basePath + 'css/src',
cssSrcFiles     = cssSrcDir + '/**/*.scss',
cssDistDir      = basePath + 'css/dist',
cssDestFiles    = cssDistDir + '/*.css',

postCSSProcessors = [
    plugins.pixrem,
    plugins.mqpacker,
    plugins.csswring
];

/* # CSS
   ========================================================================== */

gulp.task('sass', function () {
    gulp.src(cssSrcFiles)
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass({
        errLogToConsole: true
    }))
    .pipe(plugins.prefix())
    .pipe(plugins.postcss(postCSSProcessors))
    .pipe(plugins.sourcemaps.write('./'))
    .pipe(gulp.dest(cssDistDir));

});

gulp.task('scsslint', function () {
    gulp.src(cssSrcFiles)
    .pipe(plugins.scsslint({'config': '.scss-lint.yml', 'endless': true}));
});

// Inline a few essential styles to header of all pages.
// Choose your own essential styles to inine and 
gulp.task('inlineCSS', function () {
    var css = gulp
    .src(cssSrcDir + '/inline.scss')
    .pipe(plugins.sass({
        errLogToConsole: true
    }))
    .pipe(plugins.prefix())
    .pipe(plugins.postcss(postCSSProcessors));

    function fileContents(filePath, file) {
        return file.contents.toString();
    }

    return gulp
        .src(['/index.html'])
        .pipe(plugins.inject(css, {transform: fileContents}))
        .pipe(gulp.dest('./'));
});

gulp.task('moveAssets', function () {
    gulp.src([cssSrcDir + '/assets/**/*']).pipe(gulp.dest(cssDistDir + '/assets/'));
});

// ==========================================================================
// # CORE TASKS
// ==========================================================================

// Default task
gulp.task('default', ['sass', 'scsslint'], function () {
    gulp.watch(cssSrcFiles, ['sass', 'scsslint', 'inlineCSS', 'moveAssets']);
});

// Build
gulp.task('build', ['sass']);
