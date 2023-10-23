export interface INode {
  type: string
}

export interface IProgram extends INode {
  type: string // "Program"
  body: IStatement[]
}

export interface IIdentifier extends INode {
  type: string // "Identifier"
  name: string
}

export interface IExpression extends INode {}

export interface IIntLiteral extends IExpression {
  type: string // "IntLiteral"
  value: number
}

export interface IVariable extends IExpression {
  type: string // "Variable"
  id: string
}

export interface IStatement extends INode {}

export interface IExpressionStatement extends IStatement {
  type: string // "ExpressionStatement"
  expression: IExpression
}

export interface IBlockStatement extends IStatement {
  type: string // "BlockStatement"
  body: IStatement[]
}

export interface IFunctionBody extends IBlockStatement {}

export interface IFunction extends INode {
  id: string
  params: IIdentifier[] | null
  body: IFunctionBody
}

export interface IOperatorExpression extends IExpression {
  type: string // "OperatorExpression"
  operator: Operator
  left: IIntLiteral
  right: IIntLiteral
}
export enum Operator {
  "PLUS", "MINUS", "MULTIPLY", "DIVISION"
}

export interface IAssignOperatorExpression extends IExpression {
  type: string // "AssignOperatorExpression"
  operator: AssignOperator
  left: IVariable
  right: IExpression
}
export enum AssignOperator {
  "ASSIGN"
}