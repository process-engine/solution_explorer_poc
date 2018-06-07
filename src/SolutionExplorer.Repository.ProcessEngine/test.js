const SolutionExplorerProcessEngineRepository = require('./dist/SolutionExplorerProcessEngineRepository').SolutionExplorerProcessEngineRepository;

async function test() {
  const repo = new SolutionExplorerProcessEngineRepository();

  const diagrams = await repo.getDiagrams();
  console.log(diagrams)
}

test().then(console.log).catch(console.log);
