import createConfig from '../webpack.config';
import compiler from 'webpack';

const statsConfig = {
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false,
    excludeAssets: /\.map/,
    warnings: false,
    builtAt: false,
    env: true,
    hash: false,
    version: false
};

const config = createConfig();

export default function runWebpack () {
    return new Promise((resolve, reject) => {
        compiler(config, (err, stats) => {
            if (err) {
                return reject(err);
            }
            process.stdout.write(`${stats.toString(statsConfig)}\n`);
            resolve();
        });
    });
}
