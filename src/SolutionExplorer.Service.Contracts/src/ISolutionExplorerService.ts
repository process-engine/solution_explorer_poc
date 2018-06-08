import {ISolution, IDiagram} from 'solutionexplorer.contracts';

export interface ISolutionExplorerService {
  openSolution(pathspec: string): Promise<boolean>;
  loadSolution():  Promise<ISolution>;
  saveSolution(solution: ISolution, path: string): Promise<boolean>;
  loadDiagram(diagramName: string): Promise<IDiagram>;
  saveDiagram(diagram: IDiagram, path: string): Promise<boolean>;
}
