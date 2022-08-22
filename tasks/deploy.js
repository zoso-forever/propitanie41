import { src } from "gulp";
import ghPages from "gulp-gh-pages";

export default function deployBuild() {
    return src("./dist/**/*").pipe(ghPages());
}
