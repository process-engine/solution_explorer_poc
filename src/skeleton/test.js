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
    const service = await container.resolveAsync('SolutionExplorer');
    console.log(service);

    console.log('Bootstrapper started successfully.');
  } catch(error) {
    console.log('Bootstrapper failed to start.', error);
  }
}

start();
