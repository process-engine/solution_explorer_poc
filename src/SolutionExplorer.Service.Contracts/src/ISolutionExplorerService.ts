import {ISolution, IDiagram} from 'solutionexplorer.contracts';

export interface ISolutionExplorerService {
  openSolution(pathspec: string): boolean;
  loadSolution(): ISolution;
  saveSolution(solution: ISolution, path: string): boolean;
  loadDiagram(diagramName: string): IDiagram;
  saveDiagram(diagram: IDiagram, path: string): boolean;
}
