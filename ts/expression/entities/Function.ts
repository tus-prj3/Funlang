import {Interpreter} from "../../engine/Interpreter";
import {IIdentifier, IStatement} from "../interface/INode";
import {Variable} from "./Variable";
import {ReturnNotifier} from "../../types/ReturnNotifier";

/**
 * 関数の実態
 */
export abstract class Func {
  abstract name: string
  abstract invoke(arg: any[]): any
}

export class Println extends Func {
  name: string = 'println'

  invoke(arg: any[]): any {
    console.info(arg[0])
  }
}

export class DynamicFunction extends Func {
  name: string
  context: Interpreter
  params: IIdentifier[]
  block: IStatement[]

  constructor(name: string, ctx: Interpreter, params: IIdentifier[], block: IStatement[]) {
    super();
    this.name = name
    this.context = ctx
    this.params = params
    this.block = block
  }

  invoke(args: any[]): any {
    for (let i = 0; i < this.params.length; i++) {
      const param = this.params[i]
      const variable = this.context.variable(this.context.varOrFunc(param))
      if (i < args.length) {
        variable.value = this.context.value(args[i])
      } else {
        variable.value = null
      }
    }
    // 関数定義内では return 可能
    const returnNotifier = new ReturnNotifier(true, false)
    return this.context.body(this.block, returnNotifier)
  }
}