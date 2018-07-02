import {IQueryClause, IIdentity} from '@essential-projects/core_contracts';
import {IPagination, ISolutionExplorerRepository} from 'solutionexplorer.repository.contracts';
import {IProcessDefEntity} from '@process-engine/process_engine_contracts';
import {IDiagram, ISolution} from 'solutionexplorer.contracts';
import {NotFoundError, InternalServerError} from '@essential-projects/errors_ts';
import fetch from 'node-fetch';

export class SolutionExplorerProcessEngineRepository implements ISolutionExplorerRepository {

  private _baseUri: string;
  private _identity: IIdentity;

  public async openPath(pathspec: string, identity: IIdentity): Promise<void> {
    if (pathspec.endsWith('/')) {
      pathspec = pathspec.substr(0, pathspec.length - 1);
    }
    const baseUri: string = `${pathspec}/datastore/ProcessDef`;

    let response: BodyInit;
    try {
      response = await fetch(baseUri);
    } catch (e) {
      throw new NotFoundError('Datastore not reachable');
    }

    const statusWasNotOk = response.status !== 200;
    if (statusWasNotOk) {
      throw new NotFoundError('Solution was not found');
    }

    this._baseUri = baseUri;
    this._identity = identity;
  }

  public async getDiagrams(): Promise<Array<IDiagram>> {
    const response: BodyInit = await fetch(`${this._baseUri}/?limit="ALL"`)
      .then(res => res.json());

    const processDefList: Array<IProcessDefEntity> = response.data;

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

    const response: BodyInit = await fetch(url)
      .then(res => res.json());
    const processDefList: Array<IProcessDefEntity> = response.data;

    const diagrams: IDiagram = this._mapProcessDefToDiagram(processDefList[0]);

    return diagrams;
  }

  public async saveSolution(solution: ISolution, pathspec?: string): Promise<void> {
    if (pathspec) {

      try {
        await this.openPath(pathspec, this._identity);
      } catch (e) {
        throw new NotFoundError('Given Pathspec was not reachable');
      }

      solution.uri = pathspec;
      solution.diagrams.forEach((diagram: IDiagram) => {
        diagram.uri = `${pathspec}/datastore/ProcessDef/${diagram.id}`;
      });
    }

    const promises: Array<Promise<void>> = solution.diagrams.map((diagram: IDiagram) => {
      return this.saveDiagram(diagram);
    });

    await Promise.all(promises);
  }

  public async saveDiagram(diagramToSave: IDiagram, pathspec?: string): Promise<void> {
    const options: Object = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          xml: diagramToSave.xml,
      }),
    };

    let response: BodyInit;
    try {
      response = await fetch(`${diagramToSave.uri}/updateBpmn`, options)
        .then(res => res.json());
    } catch(e) {
      throw new NotFoundError('Datastore not reachable');
    }

    const body: {result: boolean} = response;
    const saveNotSucessfull: boolean = body.result === false;

    if (saveNotSucessfull) {
      throw new InternalServerError('Diagram could not be saved');
    }
  }

  private _mapProcessDefToDiagram = (processDef: IProcessDefEntity): IDiagram => {
    const diagram: IDiagram = {
      name: processDef.name,
      xml: processDef.xml,
      id: processDef.id,
      uri: `${this._baseUri}/${processDef.id}`,
    };
    return diagram;
  }
}
