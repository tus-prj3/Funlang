import {
  AssignOperator,
  IAssignOperatorExpression,
  IBlockStatement,
  IExpression,
  IExpressionStatement, IFunction, IFunctionBody,
  IIdentifier, IIntLiteral,
  INode, IOperatorExpression,
  IProgram,
  IStatement, IVariable, Operator
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

export class FExpressionStatement implements IExpressionStatement {
  type = "ExpressionStatement"
  expression: IExpression

  constructor(expression: IExpression) {
    this.expression = expression
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

export class FVariable implements IVariable {
  type: string = "Variable"
  id: string

  constructor(id: string) {
    this.id = id
  }
}

export class FFunction implements IFunction {
  id: string
  params: IIdentifier[] | null
  type = "Function"
  body: IFunctionBody

  constructor(id: string, params: IIdentifier[] | null, body: IFunctionBody) {
    this.id = id
    this.params = params
    this.body = body
  }
}

export class FFunctionBody implements IFunctionBody {
  body: IStatement[];
  type: string = "FunctionBody"

  constructor(body: IStatement[]) {
    this.body = body
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

export class FAssignOperatorExpression implements IAssignOperatorExpression {
  left: IVariable
  operator: AssignOperator
  right: IExpression
  type: string = "AssignOperatorExpression"

  constructor(operator: AssignOperator, left: IVariable, right: IExpression) {
    this.operator = operator
    this.left = left
    this.right = right
  }
}