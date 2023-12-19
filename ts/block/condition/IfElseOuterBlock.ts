import { Block } from "../base/Block";
import {OuterBlock} from "../base/OuterBlock";
import {IExpression} from "../../expression/interface/INode";
import {Vec2} from "../../types/Vec2";
import {blockStore} from "../../index";
import {BlockPosition} from "../../interface/IBlockPosition";
import {LOGIC} from "../../types/Color";
import {FIfElseStatement} from "../../expression/FNode";
import {ComparisonOuterBlock} from "../ComparisonOuterBlock";

export class IfElseOuterBlock extends OuterBlock {
  constructor() {
    super(new Vec2(100, 100), 125, 250, `if-else_${blockStore.blocks.length}`, [
      new BlockPosition(25, 25, 100, 50),
      new BlockPosition(25, 100, 100, 50),
      new BlockPosition(25, 175, 100, 50)
    ]);

    const ifText = document.createElement('span')
    ifText.innerText = "もし"
    ifText.style.fontSize = '12px'
    ifText.style.fontWeight = 'bold'
    ifText.style.position = 'absolute'
    ifText.style.color = 'white'
    ifText.style.top = '5px'
    ifText.style.left = '5px'

    const thenText = document.createElement('span')
    thenText.innerText = "ならば"
    thenText.id = "thenText"
    thenText.style.fontSize = '12px'
    thenText.style.fontWeight = 'bold'
    thenText.style.position = 'absolute'
    thenText.style.color = 'white'
    thenText.style.top = '80px'
    thenText.style.left = '5px'

    const elseText = document.createElement('span')
    elseText.innerText = "そうでなければ"
    elseText.id = "elseText"
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
      (children[0][0] as ComparisonOuterBlock).getExpression(),
      children[1][0].connectedNextBlocks().map((block) => block.getExpression()),
      children[2][0].connectedNextBlocks().map((block) => block.getExpression())
    )
  }

  public innerConnect(tryingToSetChildBlock: Block) {
    super.innerConnect(tryingToSetChildBlock);
    const blockPositions = Array.from(this.childrenPositions.keys())

    const secondBlockPosition = blockPositions[1]
    let thenIndex = this.findThenText() 
    const thenText = this.element.children[thenIndex] as HTMLElement
    thenText.style.top = secondBlockPosition.y - 20 + 'px'

    const thirdBlockPosition = blockPositions[2]
    let elseIndex = this.findElseText()
    const elseText = this.element.children[elseIndex] as HTMLElement
    elseText.style.top = thirdBlockPosition.y - 20 + 'px'

    if (elseIndex > thenIndex) {
      this.element.children[elseIndex]
      this.element.children[thenIndex]
    }else {
      this.element.children[thenIndex]
      this.element.children[elseIndex]
    }

    this.element.appendChild(thenText)
    this.element.appendChild(elseText)

    console.log(this.element.children)
  }

  private findThenText() : number {
    for (let i = 0; i < this.element.children.length; i++) {
      const prevHTMLElement = this.element.children[i] as HTMLElement
      if (prevHTMLElement.id == "thenText") {
        return i
      }
    }
    return -1
  }

  private findElseText() : number {
    for (let i = 0; i < this.element.children.length; i++) {
      const prevHTMLElement = this.element.children[i] as HTMLElement
      if (prevHTMLElement.id == "elseText") {
        return i
      }
    }
    return -1
  }
}