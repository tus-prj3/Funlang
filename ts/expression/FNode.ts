import {
  AssignOperator,
  ComparisonOperator,
  IAssignOperatorExpression,
  IBlockStatement,
  IComparisonExpression, IDynamicFunction,
  IExpression,
  IFunction,
  IIdentifier, IIfElseStatement, IIfStatement, IIntLiteral,
  ILogicalExpression,
  IOperatorExpression,
  IProgram, IReturnStatement,
  IStatement, IVariable, LogicalOperator, Operator
} from "./interface/INode";

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

export class FLogicalExpression implements ILogicalExpression {
  left: IExpression
  logical: LogicalOperator
  right: IExpression
  type: string = "ComparisonExpression"

  constructor(logical: LogicalOperator, left: IExpression, right: IExpression) {
    this.logical = logical
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

export class FIfStatement implements IIfStatement {
  blockOfThen: IStatement[];
  condition: IComparisonExpression;
  type: string = "IfStatement"

  constructor(condition: IComparisonExpression, blockOfThen: IStatement[]) {
    this.blockOfThen = blockOfThen
    this.condition = condition
  }
}

export class FIfElseStatement implements IIfElseStatement {
  blockOfThen: IStatement[];
  blockOfElse: IStatement[];
  condition: IComparisonExpression;
  type: string = "IfElseStatement"

  constructor(condition: IComparisonExpression, blockOfThen: IStatement[], blockOfElse: IStatement[]) {
    this.blockOfThen = blockOfThen
    this.condition = condition
    this.blockOfElse = blockOfElse
  }
}