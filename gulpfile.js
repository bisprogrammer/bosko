const gulp = require('gulp');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const sourceMaps = require('gulp-sourcemaps');
const svgSprite = require('gulp-svg-sprite');
const svgmin = require('gulp-svgmin');
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');

gulp.task('sass', function () {
    return gulp.src(['scss/**/*.scss', 'scss/symbol/*.scss'])
        .pipe(plumber())
        .pipe(sourceMaps.init())
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(sourceMaps.write())
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('html', function () {
    return gulp.src('*.html')
        .pipe(gulp.dest('build'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('svgSpriteBuild', function () {
    return gulp.src('i/icons/*.svg')
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        .pipe(cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
            },
        parseOptions: {xmlMode: true}
        }))
        .pipe(replace('&gt;', '>'))
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: '../../build/assets/sprite.svg',
                    render: {
                        scss: {
                            dest: '_sprite.scss',
                            template: 'scss/templates/_sprite_template.scss'
                        }
                    }
                }
            }
        }))
    .pipe(gulp.dest('scss/'));
});

gulp.task('serve', function () {
    browserSync.init({
        server: 'build'
    });
    
    gulp.watch(['scss/**/*.scss', 'scss/symbol/*.scss'], gulp.series('sass'));
    gulp.watch('*.html', gulp.series('html'));
    gulp.watch('build/js/*.js').on("change", browserSync.reload);
});