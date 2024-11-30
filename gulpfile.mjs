import gulp from 'gulp';
import * as sass from 'sass'; // Используем новый синтаксис для импорта
import gulpSass from 'gulp-sass'; // Импортируем gulp-sass
import cleanCSS from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';
import rename from 'gulp-rename';
import htmlmin from 'gulp-htmlmin';
import fileInclude from 'gulp-file-include'; // Для @@include
import browserSync from 'browser-sync'; // Для автообновления браузера
import { series, parallel, watch } from 'gulp'; // Для создания комплексных задач

// Инициализируем gulp-sass с компилятором sass
const sassCompiler = gulpSass(sass);

// Задача для компиляции SASS
export const styles = () => {
  return gulp
    .src('src/sass/**/*.+(sass|scss)') // Путь к вашим SASS/SCSS-файлам
    .pipe(sassCompiler().on('error', sassCompiler.logError)) // Компиляция SASS
    .pipe(autoprefixer()) // Добавление вендорных префиксов
    .pipe(cleanCSS({ compatibility: 'ie8' })) // Минификация CSS
    .pipe(rename({ suffix: '.min' })) // Переименуем в style.min.css
    .pipe(gulp.dest('dist/css')) // Сохраним в папку dist/css
    .pipe(browserSync.stream()); // Обновляем браузер
};

// Задача для обработки только index.html с поддержкой @@include и минификацией
export const html = () => {
  return gulp
    .src('src/html/index.html') // Обрабатываем только index.html
    .pipe(
      fileInclude({
        prefix: '@@',
        basepath: '@file', // Путь относительно текущего HTML-файла
      })
    )
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true })) // Минификация
    .pipe(gulp.dest('dist')) // Сохраняем только объединённый index.html в dist/
    .pipe(browserSync.stream()); // Обновляем браузер
};

// Задача для копирования изображений
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

// Задача для слежения за файлами и выполнения соответствующих задач
export const watchFiles = () => {
  watch('src/sass/**/*.+(sass|scss)', styles); // Наблюдение за стилями
  watch('src/html/**/*.html', html); // Наблюдение за index.html и включаемыми файлами
  watch('src/img/**/*', images); // Наблюдение за изображениями
  watch('src/icons/**/*', icons); // Наблюдение за иконками
  watch('src/fonts/**/*', fonts); // Наблюдение за шрифтами
  watch('src/audio/**/*', audio); // Наблюдение за аудио
  watch('dist/**/*').on('change', browserSync.reload); // Перезагрузка браузера при изменениях в dist
};

// Задача для запуска локального сервера и автообновления браузера
export const server = () => {
  browserSync.init({
    server: {
      baseDir: 'dist', // Указываем корневую папку
    },
  });
};

// Задача по умолчанию: запускаем все задачи одной командой
export default series(
  parallel(styles, html, images, icons, fonts, audio),
  parallel(server, watchFiles)
);