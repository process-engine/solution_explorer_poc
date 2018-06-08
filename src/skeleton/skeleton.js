'use strict';

const InvocationContainer = require('addict-ioc').InvocationContainer;

const iocModuleNames = [
  'solutionExplorer.repository.processengine',
  'SolutionExplorer.Service',
];

const iocModules = iocModuleNames.map((moduleName) => {
  return require(`${moduleName}/ioc_module`);
});

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

    console.log(service);

    console.log('Bootstrapper started successfully.');
    return await container.resolveAsync('SolutionExplorer');
  } catch(error) {
    console.log('Bootstrapper failed to start.', error);
  }
}

module.exports = start();
