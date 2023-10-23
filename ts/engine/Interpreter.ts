import {
  IAssignOperatorExpression,
  IExpression,
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
  FExpressionStatement,
  FIntLiteral,
  FOperatorExpression,
  FVariable
} from "../expression/FNode";

export class Interpreter {
  public variables: Map<String, number> = new Map<String, number>()
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
    }
  }

  public expression(expression: IExpression): any {
    if (expression instanceof FAssignOperatorExpression) {
      return this.assign(expression)
    } else if (expression instanceof FOperatorExpression) {
      return this.calc(expression)
    } else if (expression instanceof FVariable) {
      return this.variable(expression)
    } else if (expression instanceof FIntLiteral) {
      return this.value(expression)
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
    const left = operatorExpression.left
    const right = operatorExpression.right
    switch (operatorExpression.operator) {
      case Operator.PLUS:
        return this.value(left) + this.value(right)
      case Operator.MINUS:
        return this.value(left) - this.value(right)
      case Operator.MULTIPLY:
        return this.value(left) * this.value(right)
      case Operator.DIVISION:
        return this.value(left) / this.value(right)
    }
  }
}