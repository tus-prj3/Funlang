import {
  ComparisonOperator,
  IAssignOperatorExpression,
  IComparisonExpression,
  IIdentifier,
  ILogicalExpression,
  IOperatorExpression,
  IProgram,
  IStatement,
  LogicalOperator,
  Operator
} from "../expression/interface/INode";
import {
  FAssignOperatorExpression,
  FComparisonExpression,
  FDynamicFunction,
  FFunctionCallExpression,
  FIdentifier, FIfElseStatement, FIfStatement,
  FIntLiteral,
  FOperatorExpression, FRecFunction,
  FLogicalExpression,
  FReturnStatement,
  FWhileLoop,
  FForLoop
} from "../expression/FNode";
import {DynamicFunction, Func, Println} from "../expression/entities/Function";
import {Variable} from "../expression/entities/Variable";
import {ReturnNotifier} from "../types/ReturnNotifier";
import {Scope} from "../types/Scope";

export class Interpreter {
  public program: IProgram
  public globalScope: Scope
  public localScope: Scope

  constructor(program: IProgram) {
    this.program = program
    this.globalScope = new Scope()
    this.localScope = this.globalScope

    this.globalScope.functions.set("println", new Println())
  }

  public run() {
    this.body(this.program.body, new ReturnNotifier())
  }

  public body(body: IStatement[], returnNotifier: ReturnNotifier): any {
    for (let statement of body) {
      if (statement instanceof FIfStatement) {
        const returnValue = this.condition(statement, returnNotifier)
        if (returnNotifier.shouldNotifyReturnToCalledFrom) {
          return returnValue
        }
      } else if (statement instanceof FIfElseStatement) {
        const returnValue = this.condition(statement, returnNotifier)
        if (returnNotifier.shouldNotifyReturnToCalledFrom) {
          return returnValue
        }
      } else if (statement instanceof FWhileLoop){
        let condition = this.isTrue(statement.condition) //条件式がtrueかfalseか判断して格納
        while(condition == true){
          this.body(statement.blockOfThen, returnNotifier)
          condition = this.isTrue(statement.condition)
        }
      } else if (statement instanceof FForLoop){
        for(let i=0; i<statement.value; i++){
          this.body(statement.blockOfThen, returnNotifier)
        }
      }else if (statement instanceof FReturnStatement) {
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
      } else if (statement instanceof FAssignOperatorExpression) {
        this.var(statement)
      } else {
        this.expression(statement)
      }
    }
    return null
  }

  public var(expression: FAssignOperatorExpression) {
    const name = expression.left.name
    if (!this.localScope.variables.has(name)) {
      this.defineNewVariableToLocal(name)
    }
    this.expression(expression)
  }

  public defineNewVariableToLocal(name: string) {
    const variable = new Variable(
      name, 0
    )
    this.localScope.variables.set(name, variable)
    return variable
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
    } else if (expression instanceof FDynamicFunction || expression instanceof FRecFunction) {
      return this.dynamicFunc(expression)
    } else if (expression instanceof FLogicalExpression) {
      return this.logic(expression)
    }
  }

  public condition(expression: FIfStatement | FIfElseStatement, returnNotifier: ReturnNotifier): any {
    if (expression instanceof FIfStatement) {
      if (this.isTrue(expression.condition)) {
        return this.body(expression.blockOfThen, returnNotifier)
      }
    } else {
      if (this.isTrue(expression.condition)) {
        return this.body(expression.blockOfThen, returnNotifier)
      } else {
        return this.body(expression.blockOfElse, returnNotifier)
      }
    }
  }

  public isTrue(expression: IComparisonExpression) {
    return this.compare(expression)
  }

  public dynamicFunc(expression: FDynamicFunction | FRecFunction) {
    const name = expression.id.name
    if (this.localScope.functions.has(name)) {
      throw new Error("関数名はすでに使用されています.")
    }
    if (this.localScope.variables.has(name)) {
      throw new Error("関数名が変数名と重複しています.")
    }
    if (expression.args.filter((val, i, arr) => {
      return arr.indexOf(val) != i
    }).length != 0) {
      // 仮引数に重複があった場合
      throw new Error("仮引数に重複があります.")
    }

    const func = new DynamicFunction(
      name, this, expression.args, expression.body, this.globalScope, this.localScope, expression instanceof FRecFunction
    )
    this.localScope.functions.set(name, func)
    return func
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
    // スコープを順番に親方向に辿ってすでに関数・変数が定義されていないかを確認
    let searchingScope: Scope | null = this.localScope
    while (searchingScope != null) {
      if (searchingScope.functions.has(name)) {
        return searchingScope.functions.get(name)!
      }
      if (searchingScope.variables.has(name)) {
        return searchingScope.variables.get(name)!
      }
      searchingScope = searchingScope.parent
    }
    return this.defineNewVariableToLocal(name)
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
    if (typeof value === 'number' || typeof value === 'boolean' || value instanceof Func) {
      return value
    } else if (typeof value === 'boolean') {
      return value
    } else if (value instanceof Variable) {
      return value.value
    } else {
      throw new Error("right value should be instances of number, boolean, function, FVariable!")
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
      case Operator.REMAINDER:
        return left % right
    }
  }

  public compare(comparisonExpression: IComparisonExpression): boolean {
    const left = this.value(this.expression(comparisonExpression.left))
    const right = this.value(this.expression(comparisonExpression.right))
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

  public logic(logicalExpression: ILogicalExpression): boolean {
    const left = this.expression(logicalExpression.left)
    const right = this.expression(logicalExpression.right)
    switch (logicalExpression.logical) {
      case LogicalOperator.AND:
        return left && right
      case LogicalOperator.OR:
        return left || right
    }
  }

}