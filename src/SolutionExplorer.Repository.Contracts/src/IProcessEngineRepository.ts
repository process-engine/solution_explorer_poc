import {IDiagram} from 'solutionexplorer.contracts';

export interface IProcessEngineRepository {
  openPath(pathspec: string): Promise<boolean>;

  getDiagrams(): Promise<Array<IDiagram>>;

  saveDiagram(diagramToSave: IDiagram): Promise<boolean>;

  getDiagramByName(diagramName: string): Promise<IDiagram>;
}
