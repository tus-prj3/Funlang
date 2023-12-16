import {OuterBlock} from "../base/OuterBlock";
import {IExpression} from "../../expression/interface/INode";
import {Vec2} from "../../types/Vec2";
import {blockStore} from "../../index";
import {BlockPosition} from "../../interface/IBlockPosition";
import {LOGIC} from "../../types/Color";
import {FIfElseStatement} from "../../expression/FNode";
import {ComparisonOuterBrock} from "../ComparisonOuterBrock";

export class IfElseOuterBlock extends OuterBlock {
  constructor() {
    super(new Vec2(100, 100), 125, 250, `if-else_${blockStore.blocks.length}`, [
      new BlockPosition(25, 25, 100, 50),
      new BlockPosition(25, 100, 100, 50),
      new BlockPosition(25, 175, 100, 50)
    ]);

    const ifText = document.createElement('span')
    ifText.innerText = "[if]"
    ifText.style.fontSize = '12px'
    ifText.style.fontWeight = 'bold'
    ifText.style.position = 'absolute'
    ifText.style.color = 'white'
    ifText.style.top = '5px'
    ifText.style.left = '5px'

    const thenText = document.createElement('span')
    thenText.innerText = "then"
    thenText.style.fontSize = '12px'
    thenText.style.fontWeight = 'bold'
    thenText.style.position = 'absolute'
    thenText.style.color = 'white'
    thenText.style.top = '80px'
    thenText.style.left = '5px'

    const elseText = document.createElement('span')
    elseText.innerText = "else"
    elseText.style.fontSize = '12px'
    elseText.style.fontWeight = 'bold'
    elseText.style.position = 'absolute'
    elseText.style.color = 'white'
    elseText.style.top = '155px'
    elseText.style.left = '5px'


    this.element.appendChild(ifText)
    this.element.appendChild(thenText)
    this.element.appendChild(elseText)

    this.element.style.background = LOGIC
  }

  validate(): boolean {
    return false;
  }

  getExpression(): IExpression {
    const children = Array.from(this.children.values())
    return new FIfElseStatement(
      (children[0][0] as ComparisonOuterBrock).getExpression(),
      children[1][0].connectedNextBlocks().map((block) => block.getExpression()),
      children[2][0].connectedNextBlocks().map((block) => block.getExpression())
    )
  }
}