'use strict';

const SolutionExplorerProcessEngineRepository = require('./dist/index').SolutionExplorerProcessEngineRepository;

function registerInContainer(container) {
  container.register('SolutionExplorer.Repository', SolutionExplorerProcessEngineRepository);
}

module.exports.registerInContainer = registerInContainer;
