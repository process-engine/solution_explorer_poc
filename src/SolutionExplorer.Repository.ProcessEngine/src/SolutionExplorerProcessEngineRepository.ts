import {IQueryClause} from '@essential-projects/core_contracts';
import {IPagination, ISolutionExplorerRepository} from 'solutionexplorer.repository.contracts';
import {IProcessDefEntity} from '@process-engine/process_engine_contracts';
import {IDiagram} from 'solutionexplorer.contracts';
import {get, post, plugins, Response, RequestOptions} from 'popsicle';
import {NotFoundError} from '@essential-projects/errors_ts';

export class SolutionExplorerProcessEngineRepository implements ISolutionExplorerRepository {

  private _baseUri: string;

  public async openPath(pathspec: string): Promise<boolean> {
    if (pathspec.endsWith('/')) {
      pathspec = pathspec.substr(0, pathspec.length - 1);
    }
    this._baseUri = `${pathspec}/datastore/ProcessDef`;
    try {
      const response: Response = await get(this._baseUri);

      return Promise.resolve(response.status === 200);

    } catch (e) {
      throw new NotFoundError('Solution wasnt found');
    }

  }

  public async getDiagrams(): Promise<Array<IDiagram>> {
    const response: Response = await get(`${this._baseUri}/?limit="ALL"`)
      .use(plugins.parse(['json']));

    const data: IPagination<IProcessDefEntity> = response.body;
    const processDefList: Array<IProcessDefEntity> = data.data;

    const diagrams: Array<IDiagram> = processDefList.map(this._mapProcessDefToDiagram);

    return diagrams;
  }

  public async getDiagramByName(diagramName: string): Promise<IDiagram> {
    const query: IQueryClause = {
      attribute: 'name',
      operator: '=',
      value: diagramName,
    };

    const url: string = `${this._baseUri}/?query=${JSON.stringify(query)}`;

    const response: Response = await get(url)
      .use(plugins.parse(['json']));

    const data: IPagination<IProcessDefEntity> = response.body;
    const processDefList: Array<IProcessDefEntity> = data.data;

    const diagrams: IDiagram = this._mapProcessDefToDiagram(processDefList[0]);

    return diagrams;
  }

  public async saveDiagram(diagramToSave: IDiagram): Promise<boolean> {
    const options: RequestOptions = {
      url: `${diagramToSave.uri}/updateBpmn`,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          xml: diagramToSave.xml,
      }),
    };
    const response: Response = await post(options)
      .use(plugins.parse(['json']));

    const body: {result: boolean} = response.body;

    return Promise.resolve(body.result);
  }

  private _mapProcessDefToDiagram = (processDef: IProcessDefEntity): IDiagram => {
    const diagram: IDiagram = {
      name: processDef.name,
      xml: processDef.xml,
      uri: `${this._baseUri}/${processDef.id}`,
    };
    return diagram;
  }
}
