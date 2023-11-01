import {Vec2} from "../../types/Vec2";
import {blockStore} from "../../index";
import {BlockPosition} from "../../interface/IBlockPosition";
import {OuterBlock} from "../base/OuterBlock";
import {IStatement} from "../../expression/interface/INode";
import {FIntLiteral} from "../../expression/FNode";
import {FUNCTION} from "../../types/Color";

export class FunctionOuterBlock extends OuterBlock {
  constructor() {
    super(
      new Vec2(100, 100), 125, 175,
      `function_${blockStore.blocks.length}`,
      [
        new BlockPosition(25, 25, 100, 50),
        new BlockPosition(25, 100, 100, 50)
      ]
    );
    this.element.style.background = FUNCTION

    const inputText = document.createElement('span')
    inputText.innerText = "with variables:"
    inputText.style.fontSize = '12px'
    inputText.style.fontWeight = 'bold'
    inputText.style.position = 'absolute'
    inputText.style.color = 'white'
    inputText.style.top = '5px'
    inputText.style.left = '5px'

    const doText = document.createElement('span')
    doText.innerText = "do"
    doText.style.fontSize = '12px'
    doText.style.fontWeight = 'bold'
    doText.style.position = 'absolute'
    doText.style.color = 'white'
    doText.style.top = '80px'
    doText.style.left = '5px'

    this.element.appendChild(inputText)
    this.element.appendChild(doText)
  }

  validate(): boolean {
    return false;
  }

  getExpression(): IStatement {
    return new FIntLiteral(10);
  }
}