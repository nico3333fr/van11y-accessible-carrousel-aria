'use strict';

const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
const { minify } = require('terser');

const pkg = require('./package.json');

const SRC_DIR = path.join(__dirname, 'src');
const DIST_DIR = path.join(__dirname, 'dist');

const banner = [
    '/**',
    ` * ${pkg.name} - ${pkg.description}`,
    ` * @version v${pkg.version}`,
    ` * @link ${pkg.homepage}`,
    ` * @license ${pkg.license}`,
    ' */',
    ''
].join('\n');

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function listSources() {
    return fs
        .readdirSync(SRC_DIR)
        .filter(file => file.endsWith('.es6.js'))
        .map(file => path.join(SRC_DIR, file));
}

async function buildEs5() {
    ensureDir(DIST_DIR);
    const sources = listSources();

    for (const srcFile of sources) {
        const basename = path.basename(srcFile).replace(/\.es6\.js$/, '');
        const code = fs.readFileSync(srcFile, 'utf8');

        const transpiled = babel.transformSync(code, {
            presets: [
                [
                    '@babel/preset-env',
                    {
                        targets: { ie: '9' },
                        modules: false
                    }
                ]
            ],
            babelrc: false,
            configFile: false,
            compact: false
        });

        const es5Path = path.join(DIST_DIR, `${basename}.js`);
        fs.writeFileSync(es5Path, transpiled.code);

        const minified = await minify(transpiled.code);
        const minPath = path.join(DIST_DIR, `${basename}.min.js`);
        fs.writeFileSync(minPath, banner + minified.code);
    }
}

async function buildDefault() {
    ensureDir(DIST_DIR);

    await buildEs5();

    for (const srcFile of listSources()) {
        const destFile = path.join(DIST_DIR, path.basename(srcFile));
        fs.copyFileSync(srcFile, destFile);
    }
}

async function main() {
    const task = process.argv[2] || 'default';

    if (task === 'es5') {
        await buildEs5();
    } else if (task === 'default') {
        await buildDefault();
    } else {
        console.error(`Unknown task: ${task}`);
        process.exit(1);
    }
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
