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
  id: IIdentifier
}

export interface IStatement extends INode {}

export interface IBlockStatement extends IStatement {
  type: string // "BlockStatement"
  body: IStatement[]
}

export interface IFunction extends INode {
  id: IIdentifier
  args: IExpression[]
}

export interface IDynamicFunction extends INode {
  type: string
  args: IExpression[]
  body: IStatement[]
}

export interface IReturnStatement extends IStatement {
  body: IExpression
}

export interface IOperatorExpression extends IExpression {
  type: string // "OperatorExpression"
  operator: Operator
  left: IExpression
  right: IExpression
}
export enum Operator {
  "PLUS", "MINUS", "MULTIPLY", "DIVISION"
}

export interface IComparisonExpression extends IExpression {
  type: string
  comparison: ComparisonOperator
  left: IExpression
  right: IExpression
}
export enum ComparisonOperator {
  "EQ", "NE", "LT", "GT", "LE", "GE"
}

export interface ILogicalExpression extends IExpression {
  type: string
  logical: LogicalOperator
  left: IExpression
  right: IExpression
}
export enum LogicalOperator {
  "AND", "OR"
}

export interface IAssignOperatorExpression extends IExpression {
  type: string // "AssignOperatorExpression"
  operator: AssignOperator
  left: IIdentifier
  right: IExpression
}
export enum AssignOperator {
  "ASSIGN"
}