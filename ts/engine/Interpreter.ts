import {
  ComparisonOperator,
  IAssignOperatorExpression,
  IComparisonExpression,
  IExpression, IFunction, IIdentifier,
  IIntLiteral,
  IOperatorExpression,
  IProgram,
  IStatement,
  IVariable,
  Operator
} from "../expression/interface/INode";
import {
  FAssignOperatorExpression,
  FBlockStatement,
  FComparisonExpression,
  FExpressionStatement, FFunction, FIdentifier,
  FIntLiteral,
  FOperatorExpression,
  FVariable
} from "../expression/FNode";
import {Func, Println} from "../expression/entities/Function";
import {Variable} from "../expression/entities/Variable";

export class Interpreter {
  public variables: Map<string, Variable> = new Map<string, Variable>()
  public functions: Map<string, Func> = new Map<string, Func>()
  public program: IProgram

  constructor(program: IProgram) {
    this.program = program

    this.functions.set("println", new Println())
  }

  public run() {
    this.body(this.program.body)
  }

  public body(body: IStatement[]) {
    for (let statement of body) {
      this.statement(statement)
    }
  }

  public statement(statement: IStatement) {
    if (statement instanceof FExpressionStatement) {
      this.expression(statement.expression)
    } else if (statement instanceof FBlockStatement) {
      statement.body.forEach((st) => this.statement(st))
    } else if (statement instanceof FComparisonExpression) {
      this.expression(statement)
    }
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
    } else if (expression instanceof FFunction) {
      return this.invoke(expression)
    } else if (expression instanceof FComparisonExpression) {
      const tmp: boolean = this.compare(expression)
      console.log(tmp)
      return tmp
    }
  }

  public invoke(expression: FFunction) {
    const f = this.func(this.expression(expression.id))
    const value = this.value(this.expression(expression.arg))
    return f.invoke(value)
  }

  public func(value: any) {
    if (value instanceof Func) {
      return value
    }
    throw new Error("Not a function!(#func)")
  }

  public assign(assignExpression: IAssignOperatorExpression): Variable {
    console.info(assignExpression)
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
    } else if (value instanceof Variable) {
      return value.value
    } else {
      throw new Error("right value should be instances of FIntLiteral, FVariable!")
    }
  }

  public calc(operatorExpression: IOperatorExpression): number {
    const left = this.expression(operatorExpression.left)
    const right = this.expression(operatorExpression.right)
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
    console.info(comparisonExpression)
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