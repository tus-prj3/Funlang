import {OuterBlock} from "../base/OuterBlock";
import {IStatement} from "../../expression/interface/INode";
import {Vec2} from "../../types/Vec2";
import {blockStore} from "../../index";
import {BlockPosition} from "../../interface/IBlockPosition";
import {FUNCTION} from "../../types/Color";
import {FFunctionCallExpression} from "../../expression/FNode";

export class FunctionCallOuterBlock extends OuterBlock {
  functionName: string
  shouldHaveArgs: boolean

  constructor(functionName: string, shouldHaveArgs: boolean) {
    super(
      new Vec2(100, 100), 150, shouldHaveArgs ? 100 : 50,
      `${functionName}_${blockStore.blocks.length}`,
      shouldHaveArgs ? [
        new BlockPosition(
          50, 25, 100, 50
        )
      ] : []
    );
    this.functionName = functionName
    this.shouldHaveArgs = shouldHaveArgs

    const printText = document.createElement('span')
    printText.innerText = `${functionName}を呼び出す`
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

  getExpression(): IStatement {
    const children = Array.from(this.children.values())
    return new FFunctionCallExpression(
      this.functionName, this.shouldHaveArgs ? children[0][0].connectedNextBlocks().map((block) => block.getExpression()) : []
    )
  }
}