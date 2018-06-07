import {IPagination, IProcessEngineRepository} from 'solutionexplorer.repository.contracts';
import {IProcessDefEntity} from '@process-engine/process_engine_contracts';
import {IDiagram} from 'solutionexplorer.contracts';
import {get, plugins} from 'popsicle';

export class SolutionExplorerProcessEngineRepository implements IProcessEngineRepository {

  public SolutionExplorerProcessEngineRepository() {

  }

  public async getDiagrams(): Promise<Array<IDiagram>> {
    const response = await get('http://localhost:8000/datastore/ProcessDef?limit="ALL"')
      .use(plugins.parse(['json']));

    const data: IPagination<IProcessDefEntity> = response.body;
    const processDefList: Array<IProcessDefEntity> = data.data;

    const diagrams: Array<IDiagram> = processDefList.map(this._mapProcessDefToDiagram);

    return diagrams;
  }

  public saveDiagram(diagramToSave: IDiagram): Promise<void> {
    return null;
  }

  private _mapProcessDefToDiagram(processDef: IProcessDefEntity): IDiagram {
    const diagram: IDiagram = {
      name: processDef.name,
      xml: processDef.xml,
      uri: processDef.id,
    };
    return diagram;
  }

  // public async getProcesses(): Promise<IPagination<IProcessEntity>> {
  //   const url: string = `${environment.processengine.routes.processInstances}?expandCollection=["processDef"]`;
  //   const response: Response = await this.http.fetch(url, {method: 'get'});

  //   return throwOnErrorResponse<IPagination<IProcessEntity>>(response);
  // }
}
