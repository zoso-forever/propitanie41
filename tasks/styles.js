import { src, dest, series } from "gulp";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import postcssPxToRem from "postcss-pxtorem";
import stylelint from "gulp-stylelint";
import cssnano from "cssnano";
import sass from "gulp-dart-sass";
import sassGlob from "gulp-sass-glob";
// import fiber from 'fibers';
import plumber from "gulp-plumber";
import cssVariables from "postcss-css-variables";
import rename from "gulp-rename";
import { bs } from "./server";

const isProduction = process.env.NODE_ENV === "production";

const plugins = [
    cssVariables(),
    postcssPxToRem({
        rootValue: 16,
        propList: ["*"],
        replace: true,
        mediaQuery: false,
        minPixelValue: 2,
    }),
];

if (isProduction) {
    plugins.push(autoprefixer(), cssnano());
}

export function styles() {
    return src("./src/styles/index.scss", {
        sourcemaps: !isProduction,
    })
        .pipe(plumber())
        .pipe(sassGlob())
        .pipe(
            sass({
                // fiber,
                includePaths: ["node_modules"],
            }).on("error", sass.logError)
        )
        .pipe(postcss(plugins))
        .pipe(
            rename({
                basename: "main",
                suffix: ".min",
            })
        )
        .pipe(
            dest("./dist/css", {
                sourcemaps: !isProduction,
            })
        )
        .pipe(
            bs.stream({
                once: true,
            })
        );
}

export function lint() {
    return src("./src/styles/**/*.scss").pipe(
        stylelint({
            failAfterError: isProduction,
            reporters: [{ formatter: "string", console: true }],
        })
    );
}

export default series(styles, lint);
