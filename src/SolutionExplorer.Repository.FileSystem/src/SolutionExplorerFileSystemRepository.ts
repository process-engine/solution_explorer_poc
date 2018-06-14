import {ISolutionExplorerRepository} from 'solutionexplorer.repository.contracts';
import {IDiagram} from 'solutionexplorer.contracts';
import * as fs from 'fs-extra';
import * as path from 'path';

const BPMN_FILE_SUFFIX: string = '.bpmn';

export class SolutionExplorerFileSystemRepository implements ISolutionExplorerRepository {

  private _basePath: string;

  public async openPath(pathspec: string): Promise<boolean> {
    const stat: fs.Stats = await fs.stat(pathspec);

    const directoryExists: boolean = stat.isDirectory();
    if (directoryExists) {
      this._basePath = pathspec;
    }

    return Promise.resolve(directoryExists);
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

  public async saveDiagram(diagramToSave: IDiagram): Promise<boolean> {
    const fullPathToFile: string = path.join(this._basePath, `${diagramToSave.name}.bpmn`);

    await fs.writeFile(fullPathToFile, diagramToSave.xml);

    return Promise.resolve(true);
  }
}
