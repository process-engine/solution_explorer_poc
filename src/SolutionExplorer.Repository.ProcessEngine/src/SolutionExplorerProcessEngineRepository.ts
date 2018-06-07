import {ISolutionExplorerRepository, IIdentity, ISolution, IDiagram} from 'solution_explorer_contracts';

export class SolutionExplorerProcessEngineRepository implements ISolutionExplorerRepository {

  public openSolution(identity: IIdentity, pathspec: string): boolean {
    return true;
  }

  public loadSolution(): ISolution {
    return null;
  }

  public saveSolution(solution: ISolution, path: string): boolean {
    return null;
  }

  public loadDiagram(diagramName: string): IDiagram {
    return null;
  }

  public saveDiagram(diagram: IDiagram, path: string): boolean {
    return null;
  }
}
