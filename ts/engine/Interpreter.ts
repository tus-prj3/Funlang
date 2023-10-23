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
    console.info(intLiteral)
    return intLiteral.value
  }

  public calc(operatorExpression: IOperatorExpression): number {
    console.info(operatorExpression)
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
}