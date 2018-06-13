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

    /*
     * We do not assume to can handle errors correctly;
     * the repository should
     * throw HTTP-like Errors; we just care for the good path here; the Error needs to be handled above.
     */
    const targetAvailable: boolean = await this._repository.openPath(pathspec);
    if (targetAvailable) {
      this._pathspec = pathspec;
    }
    return Promise.resolve(true);
  }

  public async loadSolution(): Promise<ISolution> {
    const diagrams: Array<IDiagram> =  await this._repository.getDiagrams();

    const pathspec = this._pathspec;

    //  Cleanup name if '/' at the end {{{ //
    //  TODO: Replace this by a proper RegEx
    const name: string = pathspec.slice(-1)[0] === '/' ? pathspec.slice(0, -1) : pathspec;
    const uri: string = pathspec.slice(-1)[0] === '/' ? pathspec.slice(0, -1) : pathspec;
    //  }}} Cleanup name if '/' at the end //

    return {
      name: name,
      uri: uri,
      diagrams: diagrams,
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
