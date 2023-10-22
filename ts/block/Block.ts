import {Direction} from "../types/Direction";
import {Vec2} from "../types/Vec2";
import {getRandomColor} from "../types/Color";
import {blockStore} from "../index";
import {IBlockPosition} from "../interface/IBlockPosition";
import {OuterBlock} from "./internal";
import {getMinimumDistBlock} from "../store/BlockStore";

export class Block implements IBlockPosition {
  public x: number
  public y: number
  public readonly width: number
  public readonly height: number
  public readonly identifier: string

  public readonly element: HTMLElement

  private next: Block | null
  private prev: Block | null
  public parent: OuterBlock | null
  public parentBlockPosition: IBlockPosition | null

  // ドラッグ開始時のブロック位置
  private dragStartBlockX: number = 0
  private dragStartBlockY: number = 0

  private dragStartCursorX: number = 0
  private dragStartCursorY: number = 0

  constructor(pos: Vec2, width: number, height: number, identifier: string, appendClass: string = 'block_without_color') {
    this.x = pos.getX
    this.y = pos.getY
    this.width = width
    this.height = height
    this.identifier = identifier

    this.next = null
    this.prev = null

    this.parent = null
    this.parentBlockPosition = null

    this.element = document.createElement("div")
    this.element.style.left = pos.getX + "px"
    this.element.style.top = pos.getY + "px"
    this.element.style.width = width + "px"
    this.element.style.height = height + "px"
    this.element.className = appendClass

    this.element.style.background = getRandomColor()

    this.element.onmousedown = this.onMouseDown
    document.getElementById('workspace')?.appendChild(this.element)
  }

  /** 指定された方向の辺の中央の座標を返します */
  public middlePoint(dir: Direction): Vec2 {
    switch (dir) {
      case Direction.UP:
        return new Vec2(this.x + this.width / 2, this.y)
      case Direction.DOWN:
        return new Vec2(this.x + this.width / 2, this.y + this.height)
      case Direction.LEFT:
        return new Vec2(this.x, this.y + this.height / 2)
      case Direction.RIGHT:
        return new Vec2(this.x + this.width, this.y + this.height / 2)
    }
  }

  /** 指定された方向にブロックを結合した際に, 結合するブロックの設定すべき座標を返します */
  public connectBlockPoint(dir: Direction, block: Block): Vec2 {
    switch (dir) {
      case Direction.UP:
        return new Vec2(this.x, this.y - block.height)
      case Direction.DOWN:
        return new Vec2(this.x, this.y + this.height)
      case Direction.RIGHT:
        return new Vec2(this.x + this.width, this.y)
      case Direction.LEFT:
        return new Vec2(this.x - block.width, this.y)
    }
  }

  public center(): Vec2 {
    return new Vec2(this.x + this.width / 2, this.y + this.height / 2)
  }

  public get hasNext() {
    return this.next != null
  }

  public get hasPrev() {
    return this.prev != null
  }

  public get getNext() {
    return this.next
  }

  public get getPrev() {
    return this.prev
  }

  public get getZIndex() {
    return parseInt(this.element.style.zIndex)
  }

  /** このブロックから見て指定された座標がどの方向にあるかを返します */
  public calcDirection(to: Vec2): Direction {
    const angle = this.center().angle(to)
    if (45 <= angle && angle < 135) {
      return Direction.DOWN
    } else if (135 <= angle && angle < 215) {
      return Direction.RIGHT
    } else if (215 <= angle && angle < 305) {
      return Direction.UP
    }
    return Direction.LEFT
  }

  private isInRange(range: number, to: Vec2) {
    return this.center().distance(to) <= range;
  }

  public canConnect(targetBlock: Block) {
    const side = this.calcDirection(targetBlock.center())
    return side === Direction.DOWN && targetBlock.center().distance(this.center()) <= 200
  }

  private highlightSide(targetBlock: Block) {
    this.element.style.border = 'none'
    this.element.style.borderBottom = '4px solid red'
  }

  public connectedNextBlocks() {
    const result: Block[] = []
    const search = (block: Block | null) => {
      if (block == null) {
        return
      }
      result.push(block)
      if (block.hasNext) {
        search(block.getNext!)
      }
    }

    search(this)
    return result
  }

  /** ブロックを接続します */
  private connect(block: Block) {
    let connectTo: Block = block
    for (let target of this.connectedNextBlocks()) {
      const side = connectTo.calcDirection(target.center())
      target.setPosition(connectTo.connectBlockPoint(side, target))
      connectTo = target
    }
  }

  public setPosition(vec: Vec2) {
    this.x = vec.getX
    this.y = vec.getY
    this.element.style.left = vec.getX + "px"
    this.element.style.top = vec.getY + "px"
  }

  public setRelativePosition(vec: Vec2) {
    this.element.style.left = vec.getX + "px"
    this.element.style.top = vec.getY + "px"
    const pos = this.element.getBoundingClientRect()
    const workspace = document.getElementById('workspace')!.getBoundingClientRect()
    this.x = pos.x - workspace.x
    this.y = pos.y - workspace.y
  }

  private onMouseDown = (e: MouseEvent) => {
    this.connectedNextBlocks().forEach((block) => {
      block.dragStartBlockX = block.x
      block.dragStartBlockY = block.y
      block.dragStartCursorX = e.x
      block.dragStartCursorY = e.y

      if (block instanceof OuterBlock) {
        block.getChildren.forEach((children) => {
          children.forEach((child) => {
            child.dragStartBlockX = child.x
            child.dragStartBlockY = child.y
            child.dragStartCursorX = e.x
            child.dragStartCursorY = e.y
          })
        })
      }
    })
    if (this.hasPrev) {
      this.prev!.next = null
      this.prev = null
    }
    if (this.parent != null) {
      console.info(this)
      this.parent.dispatched = true
      this.parent.childrenPositions.get(this.parentBlockPosition!)!.style.visibility = 'visible'

      const connectedBlocks = this.connectedNextBlocks()
      const childrenBlocks = this.parent.children.get(this.parentBlockPosition!)!
      this.parent.children.set(this.parentBlockPosition!, childrenBlocks.filter((block) => !connectedBlocks.includes(block)))

      connectedBlocks.forEach((block) => {
        const nextAbsolutePos = block.element.getBoundingClientRect()
        const workspacePos = document.getElementById('workspace')!.getBoundingClientRect()
        block.setPosition(new Vec2(nextAbsolutePos.x - workspacePos.left + 10, nextAbsolutePos.y - workspacePos.top + 10))
        block.dragStartBlockX = block.x
        block.dragStartBlockY = block.y
        document.getElementById('workspace')!.appendChild(block.element)
        block.parent = null
        block.parentBlockPosition = null
      })
    }

    // TODO: OuterBlock を Block と併合することを考えるべき
    if (this instanceof OuterBlock && this.dispatched) {
      this.dispatched = false
      return
    }

    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mouseup', this.onMouseUp)
  }

  protected onMouseMove = (event: MouseEvent) => {
    this.connectedNextBlocks().forEach((block) => {
      const blockX = block.dragStartBlockX + (event.x - block.dragStartCursorX)
      const blockY = block.dragStartBlockY + (event.y - block.dragStartCursorY)
      block.setPosition(new Vec2(blockX, blockY))
    })

    blockStore.blocks.forEach((block) => {
      block.element.style.border = 'none'
      if (block instanceof OuterBlock) {
        block.removeHighlightChildren()
      }
    })

    const connectedBlocks = this.connectedNextBlocks()
    let childrenBlocks: Block[] = []
    blockStore.blocks.forEach((block) => {
      if (block instanceof OuterBlock) {
        childrenBlocks = childrenBlocks.concat(Array.from(block.children.values()).flat())
      }
    })
    const searchBlocks = blockStore.blocks.filter((block) => !connectedBlocks.includes(block) && !childrenBlocks.includes(block))
    const nearestBlock = getMinimumDistBlock(searchBlocks, this)
    if (nearestBlock != null) {
      if (nearestBlock.canConnect(this)) {
        nearestBlock.highlightSide(this)
      } else if (nearestBlock instanceof OuterBlock) {
        nearestBlock.highlightChild(this)
      }
    }
  }

  protected onMouseUp = () => {
    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mouseup', this.onMouseUp)

    const connectedBlocks = this.connectedNextBlocks()
    let childrenBlocks: Block[] = []
    blockStore.blocks.forEach((block) => {
      if (block instanceof OuterBlock) {
        childrenBlocks = childrenBlocks.concat(Array.from(block.children.values()).flat())
      }
    })
    const searchBlocks = blockStore.blocks.filter((block) => !connectedBlocks.includes(block) && !childrenBlocks.includes(block))
    const nearestBlock = getMinimumDistBlock(searchBlocks, this)
    if (nearestBlock != null) {
      if (nearestBlock.canConnect(this)) {
        this.connect(nearestBlock)

        this.prev = nearestBlock
        nearestBlock.next = this
      } else if (nearestBlock instanceof OuterBlock) {
        nearestBlock.innerConnect(this)
      }
    }

    blockStore.blocks.forEach((block) => {
      block.element.style.border = 'none'
    })
  }
}
