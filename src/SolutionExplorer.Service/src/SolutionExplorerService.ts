import {ISolutionExplorerService} from 'solutionexplorer.service.contracts';
import {ISolution, IDiagram} from 'solutionexplorer.contracts';
import {ISolutionExplorerRepository} from 'solutionexplorer.repository.contracts';

export class SolutionExplorerService implements ISolutionExplorerService {

  private _repository: ISolutionExplorerRepository;
  private _pathspec: string;

  constructor(repository: ISolutionExplorerRepository) {
    this._repository = repository;
  }

  public async openSolution(pathspec: string): Promise<boolean> {
    const success: boolean = await this._repository.openPath(pathspec);
    if (success) {
      this._pathspec = pathspec;
    }
    return Promise.resolve(true);
  }

  public async loadSolution(): Promise<ISolution> {
    const diagrams: Array<IDiagram> =  await this._repository.getDiagrams();
    return {
      diagrams: diagrams,
      name: this._pathspec,
      uri: this._pathspec,
    };
  }

  public async saveSolution(solution: ISolution): Promise<boolean> {
    const promises: Array<Promise<boolean>> = solution.diagrams.map((diagram: IDiagram) => {
      return this.saveDiagram(diagram);
    });
    await Promise.all(promises);

    return Promise.resolve(true);
  }

  public loadDiagram(diagramName: string): Promise<IDiagram> {
    return this._repository.getDiagramByName(diagramName);
  }

  public saveDiagram(diagram: IDiagram): Promise<boolean> {
    return this._repository.saveDiagram(diagram);
  }
}
