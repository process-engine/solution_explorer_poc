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
    await service.openSolution(pathspec);
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
    await service.saveSolution(solution);
  });

  it(`Should Save a Solution to Location '${pathspec}'.`, async () => {
    const service = await test;
    await service.openSolution(pathspec);
    const solution = await service.loadSolution();
    await service.saveSolution(solution, pathspec);
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
    await service.saveDiagram(diagram);
  }).timeout(60000);
  // }}} Good Case Tests //

  // Bad Case Tests {{{ //
  it('Should Raise an NotFound Error While Opening a Solution.', async () => {
    const service = await test;

    try {
      await service.openSolution(brokenPathSpec);
    } catch (error) {
      assert.equal(error._code, 404);
      return;
    }
    assert.fail('Error was not thrown.');
  })

  it('Should Not Save a Solution With Broken URI.', async () => {
    /*
     * This will test a valid solution with an URI, that is invalid.
     */
    const service = await test;
    await service.openSolution(pathspec);
    const solution = await service.loadSolution();
    solution.uri = brokenPathSpec;

    try {
      await service.saveSolution(solution);
    } catch (error) {
      assert.equal(error.code, 400);
      return;
    }
    assert.fail('Error was not thrown.');
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
    try {
      await service.saveSolution(solution, brokenPathSpec);
    } catch (error) {
      assert.equal(error.code, 404);
      return;
    }
    assert.fail('Error was not thrown.');
  });

  it('Should Not Save a Diagram, due to Wrong Diagram URI.', async () => {
    const service = await test;
    await service.openSolution(pathspec);
    const solution = await service.loadSolution();
    const diagram = await service.loadDiagram(solution.diagrams[0].name);
    diagram.uri = brokenPathSpec;

    try {
      await service.saveDiagram(diagram);
    } catch(error) {
      assert.equal(error.code, 404);
      return;
    }
    assert.fail('Error was not thrown.');
  })
  // }}} Bad Case Tests //
})
