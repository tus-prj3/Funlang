import {INode} from "./INode";

export class FIdentifier implements INode {
  type: string = "Identifier"
  name: string

  constructor(name: string) {
    this.name = name
  }
}