import {
  IAssignOperatorExpression,
  IExpression,
  IIntLiteral,
  IOperatorExpression,
  IComparisonExpression,
  IProgram,
  IStatement,
  IVariable,
  Operator,
  ComparisonOperator
} from "../expression/interface/INode";
import {
  FAssignOperatorExpression,
  FBlockStatement,
  FExpressionStatement,
  FIntLiteral,
  FOperatorExpression,
  FPrintFunction,
  FComparisonExpression,
  FVariable
} from "../expression/FNode";

export class Interpreter {
  public variables: Map<string, number> = new Map<string, number>()
  public program: IProgram

  constructor(program: IProgram) {
    this.program = program
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

  public expression(expression: IExpression): any {
    if (expression instanceof FAssignOperatorExpression) {
      return this.assign(expression)
    } else if (expression instanceof FOperatorExpression) {
      return this.calc(expression)
    } else if (expression instanceof FIntLiteral) {
      return this.value(expression)
    } else if (expression instanceof FPrintFunction) {
      return expression.invoke(this.expression(expression.arg))
    } else if (expression instanceof FComparisonExpression) {
      const tmp: boolean = this.compare(expression)
      console.log(tmp)
      return tmp
    }
  }

  public assign(assignExpression: IAssignOperatorExpression) {
    const variableName = this.variable(assignExpression.left)
    const value = this.expression(assignExpression.right)
    this.variables.set(variableName, value)
    return variableName
  }

  public variable(variable: IVariable): string {
    return variable.id
  }

  public value(intLiteral: IIntLiteral): number {
    return intLiteral.value
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