import {
  AssignOperator,
  ComparisonOperator,
  IAssignOperatorExpression,
  IBlockStatement,
  IComparisonExpression, IDynamicFunction,
  IExpression,
  IFunction,
  IIdentifier, IIntLiteral,
  IOperatorExpression,
  IProgram, IReturnStatement,
  IStatement, IVariable, Operator
} from "./interface/INode";
import {Interpreter} from "../engine/Interpreter";

export class FProgram implements IProgram {
  type: string = "Program"
  body: IStatement[]

  constructor(body: IStatement[]) {
    this.body = body
  }
}

export class FBlockStatement implements IBlockStatement {
  type = "BlockStatement"
  body: IStatement[]

  constructor(body: IStatement[]) {
    this.body = body
  }
}

export class FIdentifier implements IIdentifier {
  type: string = "Identifier"
  name: string

  constructor(name: string) {
    this.name = name
  }
}

export class FIntLiteral implements IIntLiteral {
  type: string = "IntLiteral"
  value: number

  constructor(value: number) {
    this.value = value
  }
}

/**
 * ノードとしての変数の表現
 * ※ Variable とは異なることに注意
 */
export class FVariable implements IVariable {
  type: string = "Variable"
  id: IIdentifier

  constructor(id: string) {
    this.id = new FIdentifier(id)
  }
}

export class FOperatorExpression implements IOperatorExpression {
  left: IExpression
  operator: Operator
  right: IExpression
  type: string = "OperatorExpression"

  constructor(operator: Operator, left: IExpression, right: IExpression) {
    this.operator = operator
    this.left = left
    this.right = right
  }
}

export class FComparisonExpression implements IComparisonExpression {
  left: IExpression
  comparison: ComparisonOperator
  right: IExpression
  type: string = "ComparisonExpression"

  constructor(comparsion: ComparisonOperator, left: IExpression, right: IExpression) {
    this.comparison = comparsion
    this.left = left
    this.right = right
  }
}

export class FAssignOperatorExpression implements IAssignOperatorExpression {
  left: IIdentifier
  operator: AssignOperator
  right: IExpression
  type: string = "AssignOperatorExpression"

  constructor(operator: AssignOperator, left: IIdentifier, right: IExpression) {
    this.operator = operator
    this.left = left
    this.right = right
  }
}

/**
 * ノードとしての関数の呼び出しの表現
 * ※ Func とは異なることに注意
 */
export class FFunctionCallExpression implements IFunction {
  id: IIdentifier;
  type: string = "Function"
  args: IExpression[]

  constructor(id: string, arg: IExpression[]) {
    this.id = new FIdentifier(id)
    this.args = arg
  }
}

export class FDynamicFunction implements IDynamicFunction {
  id: IIdentifier
  type: string = "Function"
  args: IIdentifier[]
  body: IStatement[]

  constructor(id: string, args: IIdentifier[], body: IStatement[]) {
    this.id = new FIdentifier(id)
    this.args = args
    this.body = body
  }
}

export class FReturnStatement implements IReturnStatement {
  body: IExpression
  type: string = "ReturnExpression"

  constructor(body: IExpression) {
    this.body = body
  }
}