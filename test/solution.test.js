const test = require('../src/skeleton/skeleton');
const assert = require('assert');

describe('Solution', function() {

  it('Should open a Solution', async () => {
    const service = await test;
    const success = await service.openSolution('http://localhost:8000');
    assert.ok(success);
  })

  it('Should load a Solution', async () => {
    const service = await test;
    await service.openSolution('http://localhost:8000');
    const solution = await service.loadSolution();
    assert.ok(solution);
  });

  it('Should save a Solution', async () => {
    const service = await test;
    await service.openSolution('http://localhost:8000');
    const solution = await service.loadSolution();
    const success = await service.saveSolution(solution);
    assert.ok(success)
  });

  it('Should load a diagram', async () => {
    const service = await test;
    await service.openSolution('http://localhost:8000');
    const solution = await service.loadSolution();
    const diagram = await service.loadDiagram(solution.diagrams[0].name);
    assert.ok(diagram);
  });

  it('Should save a daigram', async () => {
    const service = await test;
    await service.openSolution('http://localhost:8000');
    const solution = await service.loadSolution();
    const diagram = await service.loadDiagram(solution.diagrams[0].name);
    const success = await service.saveDiagram(diagram);
    assert.ok(success);
  })
})
