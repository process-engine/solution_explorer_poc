import {ISolutionExplorerRepository} from 'solutionexplorer.repository.contracts';
import {BadRequestError, NotFoundError} from '@essential-projects/errors_ts';
import {IIdentity} from '@essential-projects/core_contracts';
import {IDiagram, ISolution} from 'solutionexplorer.contracts';
import * as fs from 'fs-extra';
import * as path from 'path';

const BPMN_FILE_SUFFIX: string = '.bpmn';

export class SolutionExplorerFileSystemRepository implements ISolutionExplorerRepository {

  private _basePath: string;
  private _identity: IIdentity;

  private async _checkForDirectory(directoryPath: string): Promise<void> {
    const pathDoesNotExist: boolean = !await fs.pathExists(directoryPath);
    if (pathDoesNotExist) {
      throw new NotFoundError(`'${directoryPath}' does not exist.`);
    }

    const stat: fs.Stats = await fs.stat(directoryPath);
    const isNotDirectory: boolean = !stat.isDirectory();
    if (isNotDirectory) {
      throw new NotFoundError(`'${directoryPath}' is not an directory.`);
    }
  }

  public async openPath(pathspec: string, identity: IIdentity): Promise<void> {
    await this._checkForDirectory(pathspec);

    this._basePath = pathspec;
    this._identity = identity;
  }

  public async getDiagrams(): Promise<Array<IDiagram>> {
    const filesInDirectory: Array<string> = await fs.readdir(this._basePath);

    const bpmnFiles: Array<string> = [];

    for (const file of filesInDirectory) {
      if (file.endsWith(BPMN_FILE_SUFFIX)) {
        bpmnFiles.push(file);
      }
    }

    const diagrams: Array<Promise<IDiagram>> = bpmnFiles
      .map((file: string) => {

        const fullPathToFile: string = path.join(this._basePath, file);
        const fileNameWithoutBpmnSuffix = file.substr(0, file.length - BPMN_FILE_SUFFIX.length);

        const xmlPromise: Promise<string> = fs.readFile(fullPathToFile, 'utf8');

        return xmlPromise.then((xml: string) => {
          const diagram: IDiagram = {
            name: fileNameWithoutBpmnSuffix,
            uri: fullPathToFile,
            xml: xml
          };

          return diagram;
        });
    });

    return Promise.all(diagrams);
  }

  public async getDiagramByName(diagramName: string): Promise<IDiagram> {
    const fullPathToFile: string = path.join(this._basePath, `${diagramName}.bpmn`);

    const xml: string = await fs.readFile(fullPathToFile, 'utf8');

    const diagram: IDiagram = {
      name: diagramName,
      uri: fullPathToFile,
      xml: xml
    };

    return diagram;
  }

  // check path before check
  // interface doc override
  public async saveDiagram(diagramToSave: IDiagram): Promise<void> {
    const fullPathToFile: string = path.join(this._basePath, `${diagramToSave.name}.bpmn`);

    const uriOfDiagramWasChanged: boolean = fullPathToFile !== diagramToSave.uri;

    if (uriOfDiagramWasChanged) {
      throw new BadRequestError(`Uri of diagram was changed.`);
    }

    await this._checkForDirectory(this._basePath);

    try {
      await fs.writeFile(fullPathToFile, diagramToSave.xml);
    } catch (e) {
      const error: BadRequestError = new BadRequestError('asd');
      error.additionalInformation = e;
      throw error;
    }
  }

  public async saveSolution(solution: ISolution, path?: string): Promise<void> {
    const newPathWasSet: boolean = path !== undefined && path !== null;

    if (newPathWasSet) {
      await this.openPath(path, this._identity);
    }

    const promises: Array<Promise<void>> = solution.diagrams.map((diagram: IDiagram) => {
      return this.saveDiagram(diagram);
    });

    await Promise.all(promises);
  }
}
