import {ISolution, IDiagram} from 'solutionexplorer.contracts';
import {IIdentity} from '@essential-projects/core_contracts';

export interface ISolutionExplorerService {

  /**
   * Prepares the solution explorer service to load a given path specification.
   *
   * @param pathspec The path specification to load.
   * @param identity The identity that is used to authorize, currently unused.
   */
  // TODO: Bitte die identity nach vorne als ersten Parameter setzen.
  openSolution(pathspec: string, identity: IIdentity): Promise<void>;

  /**
   * Loads the solution, its required to call openSolution() first.
   *
   * @returns A promise, resolving to the loaded solution.
   */
  loadSolution(): Promise<ISolution>;

  /**
   * Loads a single diagram from the current solution.
   *
   * @param diagramName The name of the diagram to load.
   * @returns A promise, resolving to the loaded diagram.
   */
  loadDiagram(diagramName: string): Promise<IDiagram>;

  /**
   * Saves the given solution and all its diagrams. If a solution already
   * exists, it will be overriden. This method does not modify the currently
   * loaded pathspec.
   *
   * @param solution The solution to save.
   * @param pathspec The target path for the save operation, defaults to the source
   *                 of the solution if omitted.
   */
  saveSolution(solution: ISolution, pathspec?: string): Promise<void>;

  /**
   * Save a single diagram, if a diagram already exists, it will be overriden.
   *
   * @param diagram The diagram to save.
   * @param pathspec The target path for the save operation, defaults to the source
   *                 of the diagram if omitted.
   */
  saveDiagram(diagram: IDiagram, pathspec?: string): Promise<void>;
}
