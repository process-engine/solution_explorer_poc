'use strict';

const SolutionExplorerService = require('../src/SolutionExplorer.Service/ioc_module');
const SolutionExplorerRepository = require('../src/SolutionExplorer.Repository.FileSystem/ioc_module');

const InvocationContainer = require('addict-ioc').InvocationContainer;

const iocModules = [
  SolutionExplorerRepository,
  SolutionExplorerService
];

async function start() {

  const container = new InvocationContainer({
    defaults: {
      conventionCalls: ['initialize'],
    },
  });

  for (const iocModule of iocModules) {
    iocModule.registerInContainer(container);
  }

  container.validateDependencies();

  try {
    console.log('Bootstrapper started successfully.');
    return await container.resolveAsync('SolutionExplorer');
  } catch(error) {
    console.log('Bootstrapper failed to start.', error);
  }
}

module.exports = start();
