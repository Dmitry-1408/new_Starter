import gulp from 'gulp';
import * as sass from 'sass'; // Используем новый синтаксис для импорта
import gulpSass from 'gulp-sass'; // Импортируем gulp-sass
import cleanCSS from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';
import rename from 'gulp-rename';
import { series } from 'gulp';

// Инициализируем gulp-sass с компилятором sass
const sassCompiler = gulpSass(sass);

// Задача для компиляции SASS
export const styles = () => {
  return gulp
    .src('src/sass/style.sass') // Путь к вашему SASS-файлу
    .pipe(sassCompiler().on('error', sassCompiler.logError)) // Компиляция SASS
    .pipe(autoprefixer()) // Добавление вендорных префиксов
    .pipe(cleanCSS({ compatibility: 'ie8' })) // Минификация CSS
    .pipe(rename({ suffix: '.min' })) // Переименуем в style.min.css
    .pipe(gulp.dest('dist/css')); // Сохраним в папку dist/css
};

// Задача по умолчанию
export default series(styles);
