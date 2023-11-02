import {Interpreter} from "../../engine/Interpreter";
import {IIdentifier, IStatement} from "../interface/INode";
import {Variable} from "./Variable";

/**
 * 関数の実態
 */
export abstract class Func {
  abstract name: string
  abstract invoke(arg: any): any
}

export class Println extends Func {
  name: string = 'println'

  invoke(arg: any): any {
    console.info(arg)
  }
}

export class DynamicFunction extends Func {
  name: string
  context: Interpreter
  param: IIdentifier
  block: IStatement[]

  constructor(name: string, ctx: Interpreter, param: IIdentifier, block: IStatement[]) {
    super();
    this.name = name
    this.context = ctx
    this.param = param
    this.block = block
  }

  invoke(arg: any): any {
    const variable = this.context.variable(this.context.varOrFunc(this.param))
    variable.value = this.context.value(arg)
    this.context.body(this.block)
  }
}