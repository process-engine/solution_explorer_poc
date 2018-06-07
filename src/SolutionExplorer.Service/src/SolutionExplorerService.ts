import {ISolutionExplorerService} from 'solutionexplorer.service.contracts';
import {ISolution, IDiagram} from 'solutionexplorer.contracts';
import {IProcessEngineRepository} from 'solutionexplorer.repository.contracts';

export class SolutionExplorerService implements ISolutionExplorerService {

  public SolutionExplorerService(repo: IProcessEngineRepository) {
    console.log(repo);
  }

  public openSolution(pathspec: string): boolean {
    return null;
  }

  public loadSolution(): ISolution {
    return null;
  }

  public saveSolution(solution: ISolution): boolean {
    return null;
  }

  public loadDiagram(diagramName: string): IDiagram {
    return null;
  }

  public saveDiagram(diagram: IDiagram): boolean {
    return null;
  }

}
