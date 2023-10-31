// noinspection all
import {Block} from "./internal";
import {Vec2} from "../../types/Vec2";
import {getMinimumDistBlock} from "../../store/BlockStore";
import {BlockPosition, IBlockPosition} from "../../interface/IBlockPosition";

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

        // 接続場所を特定するためのフラグ
        let flag: boolean = false
        const dh = connectTo.height - nearestChild.height
        const blockPositions = Array.from(this.childrenPositions.keys())
        for (let i = 0; i < this.childrenPositions.size; i++) {
          // 接続場所以降の接続できる場所をずらす
          if (flag) {
            const prevBlockPosition = blockPositions[i]
            const prevHTMLElement = this.childrenPositions.get(prevBlockPosition)!
            prevHTMLElement.style.top = parseInt(prevHTMLElement.style.top.split('px')[0]) + dh + 'px'
            const prevChildren = this.children.get(prevBlockPosition)!
            const newBlockPosition = new BlockPosition(
              prevBlockPosition.x, prevBlockPosition.y + dh, prevBlockPosition.width, prevBlockPosition.height
            )

            this.childrenPositions.delete(prevBlockPosition)
            this.childrenPositions.set(newBlockPosition, prevHTMLElement)

            if (this.children.has(prevBlockPosition)) {
              this.children.delete(prevBlockPosition)
              this.children.set(newBlockPosition, prevChildren)
            }
          }
          if (blockPositions[i] === nearestChild) {
            flag = true
          }
        }

        this.childrenPositions.get(nearestChild)!.style.border = ''
        this.childrenPositions.get(nearestChild)!.style.visibility = 'hidden'

        innerConnectBlocks.forEach((innerConnectBlock) => {
          innerConnectBlock.parent = this
          innerConnectBlock.parentBlockPosition = nearestChild

          this.element.appendChild(
            innerConnectBlock.element
          )
        })
        this.recalculateHeight()

        console.info(this.childrenPositions)
        console.info(this.children)
      }
    }
  }

  public recalculateHeight() {
    let placeHolderHeight = 0
    let childrenBlocksAllHeight = 0
    this.children.forEach((value, key) => {
      let childrenBlocksHeight = 0
      value.forEach((childBlock) => {
        childrenBlocksHeight += childBlock.height
      })
      placeHolderHeight += key.height
      childrenBlocksAllHeight += Math.max(key.height, childrenBlocksHeight)
    })
    const nextHeight = (this.initialHeight - placeHolderHeight) + childrenBlocksAllHeight
    this.element.style.height = nextHeight + 'px'
    this.height = nextHeight
  }

  public removeHighlightChildren() {
    Array.from(this.childrenPositions.values())
      .forEach((elem) => elem.style.border = '')
  }
}
