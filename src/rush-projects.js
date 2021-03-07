const { resolve } = require("path");
const rushLib = require("@microsoft/rush-lib");

function createRushProjectAliases() {
  const rushConfiguration = rushLib.RushConfiguration.loadFromDefaultLocation({
    startingFolder: process.cwd(),
  });

  return rushConfiguration.projects.reduce((acc, project) => {
    const relativePath = resolve(
      rushConfiguration.rushJsonFolder,
      project.projectRelativeFolder
    );
    if (relativePath) {
      acc[project.packageName] = relativePath;
    }
    return acc;
  }, {});
}

module.exports = {
  createRushProjectAliases,
}
