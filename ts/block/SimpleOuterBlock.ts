import {OuterBlock} from "./base/OuterBlock";
import {IExpression, IStatement} from "../expression/interface/INode";
import {Vec2} from "../types/Vec2";
import {IBlockPosition} from "../interface/IBlockPosition";
import {FBlockStatement} from "../expression/FNode";

export class SimpleOuterBlock extends OuterBlock {
  constructor(identifier: string, childrenPositions: IBlockPosition[]) {
    super(new Vec2(100, 100), 125, 100, identifier, childrenPositions);
  }

  protected getChildrenExpression(): IStatement[] {
    return Array.from(this.children.values()).flat().map((block) => {
      return block.getExpression()
    })
  }

  getExpression(): IExpression {
    return new FBlockStatement(this.getChildrenExpression())
  }

  validate(): boolean {
    return true;
  }
}