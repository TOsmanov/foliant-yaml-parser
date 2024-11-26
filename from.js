// @ts-check

const fs = require('fs')
const YAML = require('yaml')
const shell = require('shelljs')
const {
    env,
    path,
    project_path,
    rel_path,
    include
} = require('./index.js')

const cwd = process.cwd()

const configFileName = "foliant.yml"
const cacheDir = ".multiprojectcache"

const resolve = function (str) {
    const repoUrl = str.split('#')[0]
    const revision = str.split('#')[1]
    let url, content
    let configPath
    try {
        let branchArg = ''
        url = new URL(repoUrl);
        shell.cd(cacheDir)
        if (revision !== undefined) {
            branchArg = `-b ${revision}`
        }

        shell.exec(`git clone ${branchArg} ${url} ./subproject/`)
        shell.cd(cwd)

        configPath = `${cacheDir}/subproject/${configFileName}`
    } catch (_) {
        configPath = `${str}/${configFileName}`
        fs.cpSync(configPath, cacheDir, {recursive: true})
    }
    content = fs.readFileSync(configPath, 'utf-8')
    console.log('content',content )

    const config = YAML.parse(content, {
        customTags: [env, path, project_path, rel_path, include]
    })
    console.log(config)
    const subprojectChapters = {
        [config.title]: config.chapters
    }
    console.log(subprojectChapters)
    return subprojectChapters
};

const resolveFrom = function (str) {
    fs.mkdirSync(cacheDir)
    try {
        const chapters = resolve(str)
        fs.rmSync(cacheDir, { recursive: true })
        return chapters
    } catch (error) {
        fs.rmSync(cacheDir, { recursive: true })
        return error
    }
}

module.exports = {
    resolveFrom
}
