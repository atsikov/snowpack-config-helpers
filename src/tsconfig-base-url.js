const { basename, dirname, join, parse, resolve } = require('path')
const { readFileSync, readdirSync } = require('fs')
const { ts } = require('typescript')

function createBaseUrlAliases(configPath = join(__dirname, 'tsconfig.json')) {
  const configDir = dirname(configPath)
  const configFileContents = readFileSync(configPath, 'utf8').toString()
  const configJson = ts.parseConfigFileTextToJson(configPath, configFileContents)
  const configParseResult = ts.parseJsonConfigFileContent(
    configJson.config,
    ts.sys,
    configDir,
  )
  const baseUrl = resolve(
    configDir,
    configParseResult.options && configParseResult.options.baseUrl,
  )

  return readdirSync(baseUrl)
    .map(entry => join(baseUrl, entry))
    .reduce((acc, entry) => {
      const fullFileName = basename(entry)
      const name = parse(fullFileName).name
      if (name === 'index') {
        return acc
      }

      if (!fullFileName.endsWith('.d.ts')) {
        // In case base dir contains dir and module with the same name, do not overwrite entry with dir
        if (!acc[name]) {
          acc[name] = entry
        }
      } else {
        // Add both filename and filename.d to aliases
        const baseDefinitionName = name.slice(0, name.lastIndexOf('.'))
        if (!acc[name]) {
          acc[name] = entry
        }
        if (!acc[baseDefinitionName]) {
          acc[baseDefinitionName] = entry
        }
      }
      return acc
    }, {})
}

module.exports = {
  createBaseUrlAliases,
}
