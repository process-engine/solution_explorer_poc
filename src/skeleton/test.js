'use strict';

const InvocationContainer = require('addict-ioc').InvocationContainer;

const iocModuleNames = [
  'solutionexplorer.repository.processengine',
  'solutionexplorer.service',
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

    console.log(await service.openSolution('http://localhost:8000'));

    const solution =  await service.loadSolution();
    console.log("solution: ", solution);

    const diagram = solution.diagrams[0];
    console.log("diagram: ", diagram);

    const diagramWasSaved = await service.saveDiagram(diagram);
    console.log("diagramWasSaved: ", diagramWasSaved);

    const diagramFromName = await service.loadDiagram('Prozess erstellen');
    console.log("diagramFromName", diagramFromName);

    const solutionSaveResult = await service.saveSolution(solution);
    console.log("solutionSaveResult", solutionSaveResult);
    console.log('Bootstrapper started successfully.');
  } catch(error) {
    console.log('Bootstrapper failed to start.', error);
  }
}

start();
