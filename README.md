# SolutionExplorerPOC

The solution explorer service provides an API to load and save solutions.

## Motivation

This serves as a proof of concept for the further development of the "Solution
Explorer".

## TL;DR

```bash
npm install && npm run build && npm test
```

## Setup

To install dependencies:

`npm install`

To build the project:

`npm run build`

Now you need to start a process-engine. To do this, follow the guide on:

https://github.com/process-engine/skeleton

To finally run the tests:

`npm test`

## Usage

```typescript
// get an instance of the ISolutionExplorerService
const service: ISolutionExplorerService = (...);

// open a solution located at 'http://localhost:8000'
const loadedSolution = await service.openSolution('http://localhost:8000');

// load the solution from the storage
const solution: ISolution = await service.loadSolution();

solution.uri;       // -> http://localhost:8000
solution.diagrams;  // -> [ { name: 'Prozess', (...) }, (...) ]

// now edit the solution, for example
solution.diagrams[0].xml = (...);

await service.saveSolution(solution);
```

## Storage

Solutions can be loaded and saved from different sources. Currently there are
the following:

- ProcessEngine HTTP `datastore`

## Definitions

**Solution**

A solution is a set of diagrams, there are these properties:

- `name` - the name
- `diagrams` - diagrams that exists inside this solution
- `uri` - the storage location

**Diagram**

Every diagram is part of a solution. Each diagram contains a bpmn process,
stored as xml. A diagram has these properties:

- `name` - the name
- `xml` - the xml of the diagram
- `uri` - the storage location

## Methods

```typescript
/**
 * Prepares the solution explorer service to load a given path specification.
 *
 * @param pathspec The path specification to load.
 * @returns A promise, resolving to true if the operation was successfull.
 */
openSolution(pathspec: string): Promise<boolean>;

/**
 * Loads the solution, its required to call openSolution() first.
 *
 * @returns A promise, resolving to the loaded solution.
 */
loadSolution(): Promise<ISolution>;

/**
 * Saves the given solution and all its diagrams.
 *
 * @param solution The solution to save.
 * @param path The target path for the save operation, defaults to the source
 *             of the solution if omitted.
 * @returns A promise, resolving to true if the operation was successfull.
 */
saveSolution(solution: ISolution, path?: string): Promise<boolean>;

/**
 * Loads a single diagram from a solution.
 *
 * @param diagramName The name of the diagram to load.
 * @returns A promise, resolving to the loaded diagram.
 */
loadDiagram(diagramName: string): Promise<IDiagram>;

/**
 * Save a single diagram.
 *
 * @param diagram The diagram to save.
 * @param path The target path for the save operation, defaults to the source
 *             of the diagram if omitted.
 * @returns A promise, resolving to true if the operation was successfull.
 */
saveDiagram(diagram: IDiagram, path?: string): Promise<boolean>;
```
