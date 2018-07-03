import {ISolutionExplorerRepository} from 'solutionexplorer.repository.contracts';
import {BaseError, BadRequestError, NotFoundError} from '@essential-projects/errors_ts';
import {IIdentity} from '@essential-projects/core_contracts';
import {IDiagram, ISolution} from 'solutionexplorer.contracts';

import * as fs from 'fs';
import * as path from 'path';

const BPMN_FILE_SUFFIX: string = '.bpmn';

export class SolutionExplorerFileSystemRepository implements ISolutionExplorerRepository {

  private _basePath: string;
  private _identity: IIdentity;

  public async openPath(pathspec: string, identity: IIdentity): Promise<void> {
    await this._checkForDirectory(pathspec);

    this._basePath = pathspec;
    this._identity = identity;
  }

  public async getDiagrams(): Promise<Array<IDiagram>> {
    const filesInDirectory: Array<string> = await fs.readdirSync(this._basePath);
    const bpmnFiles: Array<string> = [];

    for (const file of filesInDirectory) {
      if (file.endsWith(BPMN_FILE_SUFFIX)) {
        bpmnFiles.push(file);
      }
    }

    const diagrams: Array<IDiagram> = bpmnFiles
      .map((file: string) => {

        const fullPathToFile: string = path.join(this._basePath, file);
        const fileNameWithoutBpmnSuffix = file.substr(0, file.length - BPMN_FILE_SUFFIX.length);

        const xml: string = fs.readFileSync(fullPathToFile, 'utf8');

        const diagram: IDiagram = {
          name: fileNameWithoutBpmnSuffix,
          uri: fullPathToFile,
          xml: xml,
          id: fullPathToFile
        };

        return diagram;
    });

    return diagrams;
  }

  public async getDiagramByName(diagramName: string): Promise<IDiagram> {
    const fullPathToFile: string = path.join(this._basePath, `${diagramName}.bpmn`);

    const xml: string = await fs.readFileSync(fullPathToFile, 'utf8');

    const diagram: IDiagram = {
      name: diagramName,
      uri: fullPathToFile,
      xml: xml,
      id: fullPathToFile
    };

    return diagram;
  }

  public async saveDiagram(diagramToSave: IDiagram, newPathSpec?: string): Promise<void> {
    const newPathSpecWasSet: boolean = newPathSpec !== null && newPathSpec !== undefined;
    let pathToWriteDiagram: string;

    if (newPathSpecWasSet) {
      this._checkForDirectory(newPathSpec);
      this._checkWriteablity(newPathSpec);
      pathToWriteDiagram = newPathSpec;

    } else {
      const expectedUriForDiagram: string = path.join(this._basePath, `${diagramToSave.name}.bpmn`);

      const uriOfDiagramWasChanged: boolean = expectedUriForDiagram !== diagramToSave.uri;
      if (uriOfDiagramWasChanged) {
        throw new BaseError(400, 'Uri of diagram was changed.');
      }

      pathToWriteDiagram = diagramToSave.uri;
    }

    await this._checkWriteablity(pathToWriteDiagram);

    try {
      await fs.writeFileSync(pathToWriteDiagram, diagramToSave.xml);
    } catch (e) {
      const error: Error = new Error('Unable to save diagram.');
      // error.additionalInformation = e;
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

  private async _checkForDirectory(directoryPath: string): Promise<void> {
    const pathDoesNotExist: boolean = !fs.existsSync(directoryPath);
    if (pathDoesNotExist) {
      throw new NotFoundError(`'${directoryPath}' does not exist.`);
    }

    const stat: fs.Stats = fs.statSync(directoryPath);
    const isNotDirectory: boolean = !stat.isDirectory();
    if (isNotDirectory) {
      throw new BaseError(400, `'${directoryPath}' is not an directory.`);
    }
  }

  private async _checkWriteablity(filePath: string): Promise<void> {
    const directoryPath: string = path.dirname(filePath);

    await this._checkForDirectory(directoryPath);
  }
}
