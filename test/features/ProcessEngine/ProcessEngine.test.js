const assert = require('assert');

const test = require('./ProcessEngine.fixtures');

/*
 * This describes tests againt a local ProcessEngine, and it's internal databse.
 */
describe('Solution Explorer Tests Using Local Database.', function() {

  const pathspec = 'http://localhost:8000';
  const brokenPathSpec = 'http://localhost:1111';

  // Good Case Tests {{{ //
  it('Should Open a Solution.', async () => {
    const service = await test;
    const success = await service.openSolution(pathspec);
    assert.ok(success);
  })

  it('Should Load a Solution.', async () => {
    const service = await test;
    await service.openSolution(pathspec);
    const solution = await service.loadSolution();
    assert.ok(solution);
  });

  it('Should Save a Solution.', async () => {
    const service = await test;
    await service.openSolution(pathspec);
    const solution = await service.loadSolution();
    const success = await service.saveSolution(solution);
    assert.ok(success)
  });

  it(`Should Save a Solution to Location '${pathspec}'.`, async () => {
    const service = await test;
    await service.openSolution(pathspec);
    const solution = await service.loadSolution();
    const success = await service.saveSolution(solution, pathspec);
    assert.ok(success)
  });

  it('Should Load a Diagram.', async () => {
    const service = await test;
    await service.openSolution(pathspec);
    const solution = await service.loadSolution();
    const diagram = await service.loadDiagram(solution.diagrams[0].name);
    assert.ok(diagram);
  });

  it('Should Save a Diagram.', async () => {
    const service = await test;
    await service.openSolution(pathspec);
    const solution = await service.loadSolution();
    const diagram = await service.loadDiagram(solution.diagrams[0].name);
    const success = await service.saveDiagram(diagram);
    assert.ok(success);
  })
  // }}} Good Case Tests //

  // Bad Case Tests {{{ //
  it('Should Raise an NotFound Error While Opening a Solution.', async () => {
    const service = await test;
    try {
      const success = await service.openSolution(brokenPathSpec);
    } catch (e) {
      assert.ok(e._code === 404);
    }
  })

  it('Should Not Save a Solution With Broken URI.', async () => {
    /*
     * This will test a valid solution with an URI, that is invalid.
     */
    const service = await test;
    await service.openSolution(pathspec);
    const solution = await service.loadSolution();
    solution.uri = brokenPathSpec;
    /**
     * The savediagram method is used to save all diagrams but not the solution itself (name and uri).
     * This is the wrong behaviour.
     */
    const saveNotSuccessfull = !await service.saveSolution(solution);
    assert.ok(saveNotSuccessfull)
  });

  it(`Should Not Save a Solution to Broken Location '${brokenPathSpec}'.`, async () => {
    /*
     * This will test a valid solution with a valid URI,
     * but saving it to a invalid pathspec.
     */
    const service = await test;
    await service.openSolution(pathspec);
    const solution = await service.loadSolution();
    /**
     * The function saveSolution doesn't use its second parameter right now.
     * Need to be implemented.
     */
    const unableToSaveSulution = !await service.saveSolution(solution, brokenPathSpec);
    assert.ok(unableToSaveSulution)
  });

  it('Should Not Save a Diagram, due to Wrong Diagram URI.', async () => {
    const service = await test;
    await service.openSolution(pathspec);
    const solution = await service.loadSolution();
    const diagram = await service.loadDiagram(solution.diagrams[0].name);
    diagram.uri = brokenPathSpec;
    // boom
    try {
      const success = await service.saveDiagram(diagram);
    } catch(e) {
      assert.ok(e._code === 404);
    }

  })
  // }}} Bad Case Tests //
})
