import { watch as gulpWatch, series } from 'gulp';
import styles from './styles';
import { html, copy, sprite } from './misc';
import runWebpack from './webpack';
import { bs } from './server';

function reload () {
    bs.reload();
    return Promise.resolve();
}

export default function watch () {
    gulpWatch('src/styles/**/*.scss', styles);
    gulpWatch('src/**/*.html', html);
    gulpWatch('src/assets/**/*', copy);
    gulpWatch('src/icons/**/*.svg', sprite);
    gulpWatch('src/scripts/**/*.{js,html}', series(runWebpack, reload));
}
