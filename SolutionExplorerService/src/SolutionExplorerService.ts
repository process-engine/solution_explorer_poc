import {ISolutionExplorerService, IIdentity, ISolution, IDiagram} from '../../SolutionExplorerContracts/src';

export class SolutionExplorerService implements ISolutionExplorerService {

  public openSolution(identity: IIdentity, pathspec: string): boolean {

  }

  public loadSolution(): ISolution {

  }

  public saveSolution(solution: ISolution): boolean {

  }

  public loadDiagram(diagramName: string): IDiagram {

  }

  public saveDiagram(diagram: IDiagram): boolean {

  }

}
