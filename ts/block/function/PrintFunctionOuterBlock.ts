import {OuterBlock} from "../base/OuterBlock";
import {IStatement} from "../../expression/interface/INode";
import {FExpressionStatement, FPrintFunction} from "../../expression/FNode";
import {Vec2} from "../../types/Vec2";
import {blockStore} from "../../index";
import {BlockPosition} from "../../interface/IBlockPosition";
import {VariableBlock} from "../VariableBlock";
import {NumberBlock} from "../NumberBlock";
import {OperatorOuterBlock} from "../OperatorOuterBlock";
import {FUNCTION} from "../../types/Color";

export class PrintFunctionOuterBlock extends OuterBlock {
  constructor() {
    super(
      new Vec2(100, 100), 125, 100,
      `print_${blockStore.blocks.length}`,
      [
        new BlockPosition(
          25, 25, 100, 50
        )
      ]
    );

    const printText = document.createElement('span')
    printText.innerText = "[print]"
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
    const children = Array.from(this.children.values())
    if (children.length != 1) {
      return false
    }
    return children[0][0] instanceof VariableBlock
      || children[0][0] instanceof NumberBlock
      || children[0][0] instanceof OperatorOuterBlock
  }

  getExpression(): IStatement {
    const children = Array.from(this.children.values())
    return new FExpressionStatement(
      new FPrintFunction(
        children[0][0].getExpression()
      )
    )
  }
}