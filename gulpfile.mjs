import gulp from 'gulp';
import * as sass from 'sass';
import gulpSass from 'gulp-sass';
import cleanCSS from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';
import rename from 'gulp-rename';
import htmlmin from 'gulp-htmlmin';
import fileInclude from 'gulp-file-include';
import browserSync from 'browser-sync';
import { series, parallel, watch } from 'gulp';
import terser from 'gulp-terser'; // Для минификации JS

// Инициализируем gulp-sass с компилятором sass
const sassCompiler = gulpSass(sass);

// Задача для компиляции SASS
export const styles = () => {
  return gulp
    .src('src/sass/**/*.+(sass|scss)')
    .pipe(sassCompiler().on('error', sassCompiler.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
};

// Задача для копирования CSS без изменений
export const copyCSS = () => {
  return gulp
    .src('src/css/**/*.css') // Любые CSS-файлы в src/css
    .pipe(gulp.dest('dist/css')) // Копируем без изменений в dist/css
    .pipe(browserSync.stream()); // Обновляем браузер
};

// Задача для обработки HTML
export const html = () => {
  return gulp
    .src('src/html/index.html')
    .pipe(
      fileInclude({
        prefix: '@@',
        basepath: '@file',
      })
    )
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
};

// Задача для обработки изображений
export const images = () => {
  return gulp.src('src/img/**/*').pipe(gulp.dest('dist/img'));
};

// Задача для копирования иконок
export const icons = () => {
  return gulp.src('src/icons/**/*').pipe(gulp.dest('dist/icons'));
};

// Задача для копирования шрифтов
export const fonts = () => {
  return gulp.src('src/fonts/**/*').pipe(gulp.dest('dist/fonts'));
};

// Задача для копирования аудио
export const audio = () => {
  return gulp.src('src/audio/**/*').pipe(gulp.dest('dist/audio'));
};

// Задача для минификации JavaScript
export const scripts = () => {
  return gulp
    .src('src/js/**/*.js') // Обрабатываем все файлы в src/js
    .pipe(terser()) // Минификация JS
    .pipe(rename({ suffix: '.min' })) // Добавляем суффикс .min
    .pipe(gulp.dest('dist/js')) // Сохраняем в dist/js
    .pipe(browserSync.stream()); // Обновляем браузер
};

// Задача для слежения за файлами
export const watchFiles = () => {
  watch('src/sass/**/*.+(sass|scss)', styles);
  watch('src/css/**/*.css', copyCSS); // Следим за изменениями в CSS
  watch('src/html/**/*.html', html);
  watch('src/img/**/*', images);
  watch('src/icons/**/*', icons);
  watch('src/fonts/**/*', fonts);
  watch('src/audio/**/*', audio);
  watch('src/js/**/*.js', scripts);
  watch('dist/**/*').on('change', browserSync.reload);
};

// Задача для запуска локального сервера
export const server = () => {
  browserSync.init({
    server: {
      baseDir: 'dist',
    },
  });
};

// Задача по умолчанию
export default series(
  parallel(styles, copyCSS, html, images, icons, fonts, audio, scripts), // Добавили copyCSS
  parallel(server, watchFiles)
);
