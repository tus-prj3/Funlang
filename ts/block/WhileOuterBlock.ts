import { Block } from "./base/Block";
import {OuterBlock} from "./base/OuterBlock";
import {IExpression} from "../expression/interface/INode";
import {Vec2} from "../types/Vec2";
import {blockStore} from "../index";
import {BlockPosition} from "../interface/IBlockPosition";
import {LOOP} from "../types/Color";
import {FWhileLoop} from "../expression/FNode";
import {ComparisonOuterBlock} from "./ComparisonOuterBlock";

export class whileOuterBlock extends OuterBlock {
  constructor() {
    super(new Vec2(100, 100), 125, 175, `while_${blockStore.blocks.length}`, [
      new BlockPosition(25, 25, 100, 50),
      new BlockPosition(25, 100, 100, 50)
    ]);

    const ifText = document.createElement('span')
    ifText.innerText = "ループ"
    ifText.style.fontSize = '12px'
    ifText.style.fontWeight = 'bold'
    ifText.style.position = 'absolute'
    ifText.style.color = 'white'
    ifText.style.top = '5px'
    ifText.style.left = '5px'

    const thenText = document.createElement('span')
    thenText.id = "thenText"
    thenText.innerText = "ならば"
    thenText.style.fontSize = '12px'
    thenText.style.fontWeight = 'bold'
    thenText.style.position = 'absolute'
    thenText.style.color = 'white'
    thenText.style.top = '80px'
    thenText.style.left = '5px'

    const loopText = document.createElement('span')
    loopText.id = "loopText"
    loopText.innerText = "を繰り返す"
    loopText.style.fontSize = '12px'
    loopText.style.fontWeight = 'bold'
    loopText.style.position = 'absolute'
    loopText.style.color = 'white'
    loopText.style.top = '155px'
    loopText.style.left = '5px'

    this.element.appendChild(ifText)
    this.element.appendChild(thenText)
    this.element.appendChild(loopText)

    this.element.style.background = LOOP
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

  public innerConnect(tryingToSetChildBlock: Block) {
    super.innerConnect(tryingToSetChildBlock);
    const blockPositions = Array.from(this.childrenPositions.keys())
    const secondBlockPosition = blockPositions[1]
    
    let thenIndex = this.findThenText()
    let loopIndex = this.findloopText()

    const thenText = this.element.children[thenIndex] as HTMLElement
    const loopText = this.element.children[loopIndex] as HTMLElement

    thenText.style.top = secondBlockPosition.y - 20 + 'px'
    loopText.style.top = this.height - 20 + 'px'

    if (thenIndex > loopIndex) {
      this.element.children[thenIndex].remove()
      this.element.children[loopIndex].remove()
    }else {
      this.element.children[loopIndex].remove()
      this.element.children[thenIndex].remove()
    }

    this.element.appendChild(thenText)
    this.element.appendChild(loopText)
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

  private findloopText() : number {
    for (let i = 0; i < this.element.children.length; i++) {
      const prevHTMLElement = this.element.children[i] as HTMLElement
      if (prevHTMLElement.id == "loopText") {
        return i
      }
    }
    return -1
  }
}