import {Direction} from "../types/Direction";
import {Vec2} from "../types/Vec2";
import {getRandomColor} from "../types/Color";
import {blockStore} from "../index";
import {IBlockPosition} from "../interface/IBlockPosition";
import {OuterBlock} from "./internal";

export class Block implements IBlockPosition {
  public x: number
  public y: number
  public readonly width: number
  public readonly height: number
  public readonly identifier: string

  protected readonly element: HTMLElement

  private next: Block | null
  private prev: Block | null

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

  /** ブロックを接続します */
  private connect(block: Block) {
    const side = this.calcDirection(block.center())
    block.setPosition(this.connectBlockPoint(side, block))
  }

  private setPosition(vec: Vec2) {
    this.x = vec.getX
    this.y = vec.getY
    this.element.style.left = vec.getX + "px"
    this.element.style.top = vec.getY + "px"
  }

  private onMouseDown = (e: MouseEvent) => {
    this.dragStartBlockX = this.x
    this.dragStartBlockY = this.y
    this.dragStartCursorX = e.x
    this.dragStartCursorY = e.y

    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mouseup', this.onMouseUp)
    this.element.style.zIndex = '10'
  }

  private onMouseMove = (event: MouseEvent) => {
    const blockX = this.dragStartBlockX + (event.x - this.dragStartCursorX)
    const blockY = this.dragStartBlockY + (event.y - this.dragStartCursorY)
    this.setPosition(new Vec2(blockX, blockY))

    blockStore.blocks.forEach((block) => {
      block.element.style.border = 'none'
      if (block instanceof OuterBlock) {
        block.removeHighlightChildren()
      }
    })
    const nearestBlock = blockStore.getMinimumDistanceBlock(this)
    if (nearestBlock != null) {
      if (nearestBlock.canConnect(this)) {
        nearestBlock.highlightSide(this)
      } else if (nearestBlock instanceof OuterBlock) {
        nearestBlock.highlightChild(this)
      }
    }
  }

  private onMouseUp = () => {
    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mouseup', this.onMouseUp)

    const nearestBlock = blockStore.getMinimumDistanceBlock(this)
    if (nearestBlock != null && nearestBlock.canConnect(this)) {
      nearestBlock.connect(this)

      this.prev = nearestBlock
      nearestBlock.next = this
    }

    blockStore.blocks.forEach((block) => {
      block.element.style.border = 'none'
    })
    this.element.style.zIndex = '0'
  }
}
