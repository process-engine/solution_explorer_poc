import {IDiagram} from 'solutionexplorer.contracts';

export interface ISolutionExplorerRepository {
  openPath(pathspec: string): Promise<boolean>;

  getDiagrams(): Promise<Array<IDiagram>>;

  saveDiagram(diagramToSave: IDiagram): Promise<boolean>;

  getDiagramByName(diagramName: string): Promise<IDiagram>;
}