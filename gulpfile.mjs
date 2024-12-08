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

// **Задача 1**: Компиляция из `src/sass/style.sass` в `dist/css/style.min.css`
export const compileMainSass = () => {
  return gulp
    .src('src/sass/style.sass') // Только style.sass
    .pipe(sassCompiler().on('error', sassCompiler.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(rename({ suffix: '.min' })) // Добавляем .min к имени файла
    .pipe(gulp.dest('dist/css')) // Сохраняем в dist/css
    .pipe(browserSync.stream());
};

// **Задача 2**: Копирование любых файлов из `src/css` в `dist/css` без изменений
export const copyCSS = () => {
  return gulp
    .src('src/css/**/*') // Копируем любые файлы
    .pipe(gulp.dest('dist/css')) // Без изменений
    .pipe(browserSync.stream());
};

// Задача для компиляции SASS (остальные файлы)
export const styles = () => {
  return gulp
    .src(['src/sass/**/*.+(sass|scss)', '!src/sass/style.sass']) // Исключаем style.sass
    .pipe(sassCompiler().on('error', sassCompiler.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
};

// Остальные задачи без изменений...

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
    .src('src/js/**/*.js')
    .pipe(terser())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
};


// Задача для копирования изображений
export const images = () => {
  return gulp.src('src/img/**/*', { encoding: false  }) // Копируем только новые или измененные файлы
    .pipe(gulp.dest('dist/img')); // Копируем без изменений
};

// Задача для слежения за файлами
export const watchFiles = () => {
  watch('src/sass/**/*.+(sass|scss)', series(styles, compileMainSass)); // Компиляция основного и других файлов
  watch('src/css/**/*', copyCSS);
  watch('src/html/**/*.html', html);
  watch('src/icons/**/*', icons);
  watch('src/fonts/**/*', fonts);
  watch('src/audio/**/*', audio);
  watch('src/js/**/*.js', scripts);
  watch('src/img/**/*', images);
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
  parallel(styles, compileMainSass, copyCSS, html, icons, fonts, audio, scripts, images),
  parallel(server, watchFiles)
);