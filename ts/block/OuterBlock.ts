// noinspection all
import {Block} from "./internal";
import {Vec2} from "../types/Vec2";
import {getMinimumDistBlock} from "../store/BlockStore";
import {IBlockPosition} from "../interface/IBlockPosition";

export class OuterBlock extends Block {
  private readonly childrenPositions: Map<IBlockPosition, HTMLElement> = new Map<IBlockPosition, HTMLElement>()

  constructor(pos: Vec2, width: number, height: number, identifier: string, childrenPositions: IBlockPosition[]) {
    super(pos, width, height, identifier);

    childrenPositions.forEach((childrenPosition) => {
      const element = document.createElement('div')
      element.style.top = childrenPosition.x + 'px'
      element.style.left = childrenPosition.y + 'px'
      element.style.width = childrenPosition.width + 'px'
      element.style.height = childrenPosition.height + 'px'
      element.style.zIndex = '1'
      element.classList.add('block_child_notify')

      this.element.appendChild(element)
      this.childrenPositions.set(childrenPosition, element)
    })
  }

  public highlightChild(tryingToSetChildBlock: Block) {
    const nearestChild = getMinimumDistBlock(Array.from(this.childrenPositions.keys()), tryingToSetChildBlock)
    if (nearestChild != null ) {
      const nearestChildCenter = new Vec2(nearestChild.x + this.x + nearestChild.width / 2, nearestChild.y + this.y + nearestChild.height / 2)
      console.info(nearestChildCenter)
      if (nearestChildCenter.distance(tryingToSetChildBlock.center()) <= 75) {
        const element = this.childrenPositions.get(nearestChild)
        element!.style.border = '8px solid aqua'
      }
    }
  }

  public removeHighlightChildren() {
    Array.from(this.childrenPositions.values())
      .forEach((elem) => elem.style.border = '')
  }
}
