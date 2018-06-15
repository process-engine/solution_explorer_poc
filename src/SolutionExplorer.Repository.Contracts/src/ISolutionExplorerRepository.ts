import {IDiagram, ISolution} from 'solutionexplorer.contracts';
import {IIdentity} from '@essential-projects/core_contracts';

export interface ISolutionExplorerRepository {
  openPath(pathspec: string, identity: IIdentity): Promise<void>;

  getDiagrams(): Promise<Array<IDiagram>>;

  saveDiagram(diagramToSave: IDiagram): Promise<void>;

  getDiagramByName(diagramName: string): Promise<IDiagram>;

  saveSolution(solution: ISolution, pathspec?: string): Promise<void>;
}
