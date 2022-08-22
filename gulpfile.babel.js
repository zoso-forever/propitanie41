import { series, parallel } from "gulp";
import styles from "./tasks/styles";
import del from "del";
import server from "./tasks/server";
import watch from "./tasks/watch";
import { html, copy, sprite } from "./tasks/misc";
import deployBuild from "./tasks/deploy";
import runWebpack from "./tasks/webpack";

export const clean = () => del(["dist"]);
export const build = series(
    clean,
    parallel(styles, html, copy, runWebpack, sprite)
);
export const dev = series(build, parallel(server, watch));
export const deploy = series(build, deployBuild);
