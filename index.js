// @ts-check

const fs = require('fs')
const p = require('path')
const YAML = require('yaml')
const {
    resolveFrom
} = require('./from.js')

// Def custom tags
const env = {
    tag: '!env',
    resolve: str => process.env[str]
}

// Path
const path = {
    tag: '!path',
    resolve: str => resolvePathTag(str)
}
const project_path = {
    tag: '!project_path',
    resolve: str => resolveProjectPathTag(str)
}

// Includes
const rel_path = {
    tag: '!rel_path',
    resolve: str => resolveRelPathTag(str)
}

const include = {
    tag: '!include',
    resolve: str => resolveIncludeTag(str)
}
const from = {
    tag: '!from',
    resolve: str => resolveFrom(str)
}

function resolvePathTag(str) {
    return p.resolve(str)
}

function resolveProjectPathTag(str) {
    return p.resolve(`${__dirname}/${str}`)
}

function resolveRelPathTag(str) {
    return p.relative(__dirname, str)
}

function resolveIncludeTag(str) {
    const parts = str.split('#');
    if (parts.length === 1) {
        const path = p.join(__dirname, parts[0]);
        const includeFile = fs.readFileSync(path, 'utf-8');
        return YAML.parse(includeFile);
    } else if (parts.length === 2) {
        const [path, section] = [p.join(process.cwd(), parts[0]), parts[1]];
        const includeFile = fs.readFileSync(path, 'utf-8');
        return YAML.parse(includeFile)[section];
    } else {
        throw new Error('Invalid include syntax');
    }
}

const getFoliantConfig = (configContent) => {
    try {
        const obj = YAML.parse(configContent, { customTags: [env, path, project_path, rel_path, include, from] })
        return obj
    }
    catch (error) {
        console.error(error)
        return null
    }
}

module.exports = {
    getFoliantConfig,
    env,
    path,
    project_path,
    rel_path,
    include,
    from
}