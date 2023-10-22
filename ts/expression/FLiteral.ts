import {IExpression} from "./IExpression";

export class FLiteral implements IExpression {
  type: string = "Literal"
  value: string | boolean | null | number

  constructor(value: string | boolean | null | number) {
    this.value = value
  }
}