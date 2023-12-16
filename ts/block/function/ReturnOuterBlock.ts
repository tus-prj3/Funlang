import {OuterBlock} from "../base/OuterBlock";
import {IExpression, IStatement} from "../../expression/interface/INode";
import {Vec2} from "../../types/Vec2";
import {blockStore} from "../../index";
import {BlockPosition} from "../../interface/IBlockPosition";
import {FUNCTION} from "../../types/Color";
import {FReturnStatement} from "../../expression/FNode";

export class ReturnOuterBlock extends OuterBlock {
  constructor() {
    super(
      new Vec2(100, 100), 125, 100,
      `return_${blockStore.blocks.length}`,
      [
        new BlockPosition(
          25, 25, 100, 50
        )
      ]
    );

    const printText = document.createElement('span')
    printText.innerText = "戻り値"
    printText.style.color = 'white'
    printText.style.fontSize = '12px'
    printText.style.fontWeight = 'bold'
    printText.style.position = 'absolute'
    printText.style.top = '5px'
    printText.style.left = '5px'

    this.element.appendChild(printText)

    this.element.style.background = FUNCTION
  }

  validate(): boolean {
    return true;
  }

  getExpression(): IExpression {
    const children = Array.from(this.children.values())
    return new FReturnStatement(
      children[0][0].getExpression()
    );
  }
}