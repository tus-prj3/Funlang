import {Interpreter} from "../../engine/Interpreter";
import {IIdentifier, IStatement} from "../interface/INode";
import {ReturnNotifier} from "../../types/ReturnNotifier";
import {ConsoleStore} from "../../store/ConsoleStore";
import {Scope} from "../../types/Scope";

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
    ConsoleStore.out(arg[0])
  }
}

export class DynamicFunction extends Func {
  name: string
  context: Interpreter
  params: IIdentifier[]
  block: IStatement[]
  globalScope: Scope
  localScope: Scope

  constructor(name: string, ctx: Interpreter, params: IIdentifier[], block: IStatement[], globalScope: Scope, localScope: Scope) {
    super();
    this.name = name
    this.context = ctx
    this.params = params
    this.block = block
    this.globalScope = globalScope
    this.localScope = localScope
  }

  invoke(args: any[]): any {
    // 関数の呼び出しをする前に, 現在の LocalScope を親とする新しい Scope を作成する
    const parentScope = this.context.localScope
    this.context.localScope = new Scope()
    this.context.localScope.parent = parentScope
    for (let i = 0; i < this.params.length; i++) {
      const param = this.params[i]
      const variable = this.context.variable(this.context.varOrFunc(param))
      if (i < args.length) {
        variable.value = this.context.value(args[i])
      } else {
        variable.value = 0
      }
    }
    // 関数定義内では return 可能
    const returnNotifier = new ReturnNotifier(true, false)
    const returnValue = this.context.body(this.block, returnNotifier)
    // LocalScope を元に戻す
    this.context.localScope = parentScope
    return returnValue
  }
}