import {Func} from "../expression/entities/Function";
import {Variable} from "../expression/entities/Variable";

export class Scope {
  public parent: Scope | null
  public functions: Map<string, Func>
  public variables: Map<string, Variable>

  constructor() {
    this.parent = null
    this.functions = new Map<string, Func>()
    this.variables = new Map<string, Variable>()
  }
}