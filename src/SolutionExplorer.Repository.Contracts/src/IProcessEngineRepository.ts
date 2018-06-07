import {IDiagram} from 'solutionexplorer.contracts';

export interface IProcessEngineRepository {
  getDiagrams(): Promise<Array<IDiagram>>;

  saveDiagram(diagramToSave: IDiagram): Promise<void>;
}
