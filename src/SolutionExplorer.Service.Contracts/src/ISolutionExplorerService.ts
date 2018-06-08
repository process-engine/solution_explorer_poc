import {ISolution, IDiagram} from 'solutionexplorer.contracts';

export interface ISolutionExplorerService {

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
}
