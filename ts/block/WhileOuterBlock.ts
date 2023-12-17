import {OuterBlock} from "./base/OuterBlock";
import {IExpression} from "../expression/interface/INode";
import {Vec2} from "../types/Vec2";
import {blockStore} from "../index";
import {BlockPosition} from "../interface/IBlockPosition";
import {LOGIC} from "../types/Color";
import {FWhileLoop} from "../expression/FNode";
import {ComparisonOuterBlock} from "./ComparisonOuterBlock";

export class whileOuterBlock extends OuterBlock {
  constructor() {
    super(new Vec2(100, 100), 125, 175, `while_${blockStore.blocks.length}`, [
      new BlockPosition(25, 25, 100, 50),
      new BlockPosition(25, 100, 100, 50)
    ]);

    const ifText = document.createElement('span')
    ifText.innerText = "ループ(条件)"
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

    this.element.appendChild(ifText)
    this.element.appendChild(thenText)

    this.element.style.background = LOGIC
  }

  validate(): boolean {
    return false;
  }

  getExpression(): IExpression {
    const children = Array.from(this.children.values())
    return new FWhileLoop(
      (children[0][0] as ComparisonOuterBlock).getExpression(), children[1][0].connectedNextBlocks().map((block) => block.getExpression())
    )
  }
}