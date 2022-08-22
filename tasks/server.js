import { create as browserSync } from "browser-sync";

export const bs = browserSync();

export default function server() {
    return bs.init({
        reloadOnRestart: true,
        open: false,
        server: {
            baseDir: ["dist"],
            directory: false,
        },
    });
}
