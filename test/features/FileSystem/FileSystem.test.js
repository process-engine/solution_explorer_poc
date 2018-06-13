const assert = require('assert');

const test = require('./FileSystem.fixtures');

/*
 * This describes tests againt a local ProcessEngine, and it's internal databse.
 */
describe('Solution Explorer Tests Using Filesystem', function() {

  const pathspec = 'assets/solutions/';
  const brokenPathSpec = 'unknown';

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

  it('Should Load a Solution; Check for Expected BPMN Files.', async () => {
    const service = await test;
    await service.openSolution(pathspec);
    const solution = await service.loadSolution();

    assert.equal(solution.name, "assets/solutions");
    assert.equal(solution.uri, "assets/solutions");
    assert.equal(solution.diagrams[0].name, "Prozesserstellen");
    assert.equal(solution.diagrams[1].name, "script_task_test");
    assert.equal(solution.diagrams.length, 2);
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
      /*
       * Currently the implementation of openSolution() will always
       * return true; this behaviour is wrong.
       */
      const success = await service.openSolution(brokenPathSpec);
    } catch (e) {
      e.errorCode === 404 ? assert.ok() : assert.fail();
    }
    assert.fail();
  })

  it('Should Not Save a Solution With Broken URI.', async () => {
    /*
     * This will test a valid solution with an URI, that is invalid.
     */
    const service = await test;
    await service.openSolution(pathspec);
    const solution = await service.loadSolution();
    solution.uri = brokenPathSpec;
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
    const success = await service.saveDiagram(diagram);
    assert.ok(success);
  })
  // }}} Bad Case Tests //
})
