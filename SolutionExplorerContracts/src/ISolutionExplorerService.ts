import {IIdentity, ISolution, IDiagram} from './index';

export interface ISolutionExplorerService {
  openSolution(identity: IIdentity, pathspec: string): boolean;
  loadSolution(): ISolution;
  saveSolution(solution: ISolution, path: string): boolean;
  loadDiagram(diagramName: string): IDiagram;
  saveDiagram(diagram: IDiagram, path: string): boolean;
}
