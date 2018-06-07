import {IDiagram} from './IDiagram';

export interface ISolution {
  name: string;
  diagrams: Array<IDiagram>
  uri: string;
}
