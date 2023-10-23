// noinspection all
import {Block} from "./internal";
import {Vec2} from "../../types/Vec2";
import {getMinimumDistBlock} from "../../store/BlockStore";
import {IBlockPosition} from "../../interface/IBlockPosition";

export abstract class OuterBlock extends Block {
  public readonly childrenPositions: Map<IBlockPosition, HTMLElement> = new Map<IBlockPosition, HTMLElement>()
  public children: Map<IBlockPosition, Array<Block>> = new Map<IBlockPosition, Array<Block>>()
  public dispatched: boolean = false

  constructor(pos: Vec2, width: number, height: number, identifier: string, childrenPositions: IBlockPosition[]) {
    super(pos, width, height, identifier);

    childrenPositions.forEach((childrenPosition) => {
      const element = document.createElement('div')
      element.style.left = childrenPosition.x + 'px'
      element.style.top = childrenPosition.y + 'px'
      element.style.width = childrenPosition.width + 'px'
      element.style.height = childrenPosition.height + 'px'
      element.classList.add('block_child_notify')

      this.element.appendChild(element)
      this.childrenPositions.set(childrenPosition, element)
    })
  }

  public get getChildren() {
    return this.children
  }

  public highlightChild(tryingToSetChildBlock: Block) {
    const nearestChild = getMinimumDistBlock(Array.from(this.childrenPositions.keys()), tryingToSetChildBlock.relativePosition(this))
    if (nearestChild != null) {
      const nearestChildCenter = new Vec2(nearestChild.x + this.x + nearestChild.width / 2, nearestChild.y + this.y + nearestChild.height / 2)
      if (nearestChildCenter.distance(tryingToSetChildBlock.center()) <= 75) {
        const element = this.childrenPositions.get(nearestChild)
        element!.style.border = '8px solid aqua'
      }
    }
  }

  public innerConnect(tryingToSetChildBlock: Block) {
    const nearestChild = getMinimumDistBlock(Array.from(this.childrenPositions.keys()), tryingToSetChildBlock.relativePosition(this))
    if (nearestChild != null) {
      const nearestChildCenter = new Vec2(nearestChild.x + this.x + nearestChild.width / 2, nearestChild.y + this.y + nearestChild.height / 2)
      if (nearestChildCenter.distance(tryingToSetChildBlock.center()) <= 75) {
        let connectTo: Block = tryingToSetChildBlock
        connectTo.setRelativePosition(new Vec2(nearestChild.x, nearestChild.y))
        let height = nearestChild.y + connectTo.height

        const innerConnectBlocks = [tryingToSetChildBlock]

        for (let target of connectTo.connectedNextBlocks().filter((block) => block !== connectTo)) {
          // TODO: 設計を見直す
          target.setRelativePosition(new Vec2(nearestChild.x, height))
          innerConnectBlocks.push(target)
          connectTo = target
          height += target.height
        }
        this.children.set(nearestChild, innerConnectBlocks)

        this.childrenPositions.get(nearestChild)!.style.border = ''
        this.childrenPositions.get(nearestChild)!.style.visibility = 'hidden'

        innerConnectBlocks.forEach((innerConnectBlock) => {
          innerConnectBlock.parent = this
          innerConnectBlock.parentBlockPosition = nearestChild

          console.info(innerConnectBlock.parentBlockPosition)

          this.element.appendChild(
            innerConnectBlock.element
          )
        })
        this.recalculateHeight()
      }
    }
  }

  public recalculateHeight() {
    console.info(this)
    let placeHolderHeight = 0
    let childrenBlocksAllHeight = 0
    this.children.forEach((value, key) => {
      let childrenBlocksHeight = 0
      value.forEach((childBlock) => {
        childrenBlocksHeight += childBlock.height
      })
      placeHolderHeight += key.height
      childrenBlocksAllHeight += childrenBlocksHeight
    })
    const nextHeight = (this.initialHeight - placeHolderHeight) + Math.max(placeHolderHeight, childrenBlocksAllHeight)
    this.element.style.height = nextHeight + 'px'
    this.height = nextHeight
  }

  public removeHighlightChildren() {
    Array.from(this.childrenPositions.values())
      .forEach((elem) => elem.style.border = '')
  }
}
