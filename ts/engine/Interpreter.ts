import {
  ComparisonOperator,
  IAssignOperatorExpression,
  IComparisonExpression,
  IIdentifier,
  IOperatorExpression,
  IProgram,
  IStatement,
  Operator
} from "../expression/interface/INode";
import {
  FAssignOperatorExpression,
  FComparisonExpression,
  FDynamicFunction,
  FFunctionCallExpression,
  FIdentifier,
  FIntLiteral,
  FOperatorExpression,
  FReturnStatement
} from "../expression/FNode";
import {DynamicFunction, Func, Println} from "../expression/entities/Function";
import {Variable} from "../expression/entities/Variable";
import {ReturnNotifier} from "../types/ReturnNotifier";

export class Interpreter {
  public variables: Map<string, Variable> = new Map<string, Variable>()
  public functions: Map<string, Func> = new Map<string, Func>()
  public program: IProgram

  constructor(program: IProgram) {
    this.program = program

    this.functions.set("println", new Println())
  }

  public run() {
    this.body(this.program.body, new ReturnNotifier())
  }

  public body(body: IStatement[], returnNotifier: ReturnNotifier) {
    for (let statement of body) {
      if (statement instanceof FReturnStatement) {
        if (!returnNotifier.canReturnable) {
          throw new Error("ここで return を定義することはできません.")
        }
        returnNotifier.shouldNotifyReturnToCalledFrom = true
        if (statement.body == null) {
          // return が指定されているが何も返さないとき
          return null
        } else {
          // 呼び出し元に return で指定した statement を返す.
          return this.expression(statement.body)
        }
      } else {
        this.expression(statement)
      }
    }
    return null
  }

  public expression(expression: any): any {
    if (expression instanceof FAssignOperatorExpression) {
      return this.assign(expression)
    } else if (expression instanceof FOperatorExpression) {
      return this.calc(expression)
    } else if (expression instanceof FIntLiteral) {
      return this.digit(expression)
    } else if (expression instanceof FIdentifier) {
      return this.varOrFunc(expression)
    } else if (expression instanceof FFunctionCallExpression) {
      return this.invoke(expression)
    } else if (expression instanceof FComparisonExpression) {
      return this.compare(expression)
    } else if (expression instanceof FDynamicFunction) {
      return this.dynamicFunc(expression)
    }
  }

  public dynamicFunc(expression: FDynamicFunction) {
    const name = expression.id.name
    if (this.functions.has(name)) {
      throw new Error("関数名はすでに使用されています.")
    }
    if (this.variables.has(name)) {
      throw new Error("関数名が変数名と重複しています.")
    }
    if (expression.args.filter((val, i, arr) => {
      return arr.indexOf(val) != i
    }).length != 0) {
      // 仮引数に重複があった場合
      throw new Error("仮引数に重複があります.")
    }
    // 仮引数がすでに使用されている場合
    expression.args.forEach((arg) => {
      if (this.variables.has(arg.name)) {
        throw new Error(`仮引数がすでに変数として定義されています. (name: ${arg.name}`)
      }
    })

    const func = new DynamicFunction(
      name, this, expression.args, expression.body
    )
    this.functions.set(name, func)
  }

  public invoke(expression: FFunctionCallExpression) {
    const f = this.func(this.expression(expression.id))
    const value = expression.args.map((arg) => {
      return this.value(this.expression(arg))
    })
    return f.invoke(value)
  }

  public func(value: any) {
    if (value instanceof Func) {
      return value
    }
    throw new Error("Not a function!(#func)")
  }

  public assign(assignExpression: IAssignOperatorExpression): Variable {
    const variable = this.variable(this.expression(assignExpression.left))
    variable.value = this.value(this.expression(assignExpression.right))
    return variable
  }

  public varOrFunc(arg: IIdentifier): any {
    const name = arg.name
    if (this.variables.has(name)) {
      return this.variables.get(name)!
    } else if (this.functions.has(name)) {
      return this.functions.get(name)!
    } else {
      const variable = new Variable(name, 0)
      this.variables.set(name, variable)
      return variable
    }
  }

  public variable(maybeVariable: any): Variable {
    if (maybeVariable instanceof Variable) {
      return maybeVariable
    } else {
      throw new Error("left value should be an instance of FVariable!")
    }
  }

  public digit(intLiteral: FIntLiteral): number {
    return intLiteral.value
  }

  public value(value: any): any {
    if (typeof value === 'number') {
      return value
    } else if (typeof value === 'boolean') {
      return value
    }else if (value instanceof Variable) {
      return value.value
    } else {
      throw new Error("right value should be instances of FIntLiteral, FVariable!")
    }
  }

  public calc(operatorExpression: IOperatorExpression): number {
    const left = this.value(this.expression(operatorExpression.left))
    const right = this.value(this.expression(operatorExpression.right))
    switch (operatorExpression.operator) {
      case Operator.PLUS:
        return left + right
      case Operator.MINUS:
        return left - right
      case Operator.MULTIPLY:
        return left * right
      case Operator.DIVISION:
        return left / right
    }
  }

  public compare(comparisonExpression: IComparisonExpression): boolean {
    const left = this.expression(comparisonExpression.left)
    const right = this.expression(comparisonExpression.right)
    switch (comparisonExpression.comparison) {
      case ComparisonOperator.EQ:
        return left == right
      case ComparisonOperator.NE:
        return left != right
      case ComparisonOperator.LT:
        return left < right
      case ComparisonOperator.GT:
        return left > right
      case ComparisonOperator.LE:
        return left <= right
      case ComparisonOperator.GE:
        return left >= right
    }
  }
}