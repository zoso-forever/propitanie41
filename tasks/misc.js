import { src, dest } from "gulp";
import changed from "gulp-changed";
import fileInclude from "gulp-file-include";
import svgSprite from "gulp-svg-sprite";
import plumber from "gulp-plumber";
import { bs } from "./server";

export function copy() {
    return src("src/assets/**/*")
        .pipe(changed("dist"))
        .pipe(dest("dist"))
        .pipe(
            bs.stream({
                once: true,
            })
        );
}

export function html() {
    return src("src/template/pages/*.html")
        .pipe(plumber())
        .pipe(fileInclude())
        .pipe(dest("dist"))
        .pipe(
            bs.stream({
                once: true,
            })
        );
}

export function sprite() {
    return src("src/icons/**/*.svg")
        .pipe(plumber())
        .pipe(
            svgSprite({
                mode: {
                    symbol: {
                        dest: "images",
                        sprite: "icons.svg",
                        example: false,
                    },
                },
            })
        )
        .pipe(dest("dist"))
        .pipe(
            bs.stream({
                once: true,
            })
        );
}
