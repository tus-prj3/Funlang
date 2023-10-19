import {Direction} from "../consts/Direction";
import {Vec2} from "../consts/Vec2";
import {getRandomColor} from "../consts/Color";
import {blockStore} from "../index";
import {ConnectFilter} from "../util/ConnectFilter";
import {BlockType} from "./BlockType";

export class Block {
  private x: number
  private y: number
  private readonly width: number
  private readonly height: number
  private readonly identifier: string

  private readonly element: HTMLElement

  private next: Block | null
  private prev: Block | null

  private connectFilter: Map<Direction, Array<ConnectFilter>> = new Map<Direction, Array<ConnectFilter>>()
  private type: BlockType

  // ドラッグ開始時のブロック位置
  private dragStartBlockX: number = 0
  private dragStartBlockY: number = 0

  private dragStartCursorX: number = 0
  private dragStartCursorY: number = 0

  constructor(x: number, y: number, width: number, height: number, identifier: string, connectFilter: Map<Direction, Array<ConnectFilter>>, type: BlockType, appendClass: string = 'block_without_color') {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.identifier = identifier

    this.next = null
    this.prev = null

    this.element = document.createElement("div")
    this.element.style.left = x + "px"
    this.element.style.top = y + "px"
    this.element.style.width = width + "px"
    this.element.style.height = height + "px"
    this.element.className = appendClass

    this.connectFilter = connectFilter
    this.type = type

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

  public get center(): Vec2 {
    return new Vec2(this.x + this.width / 2, this.y + this.height / 2)
  }

  public get getIdentifier() {
    return this.identifier
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

  /** このブロックから見て指定された座標がどの方向にあるかを返します */
  public calcDirection(to: Vec2): Direction {
    const angle = this.center.angle(to)
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
    return this.center.distance(to) <= range;
  }

  public canConnect(targetBlock: Block) {
    const side = this.calcDirection(targetBlock.center)
    const connectFilters: Array<ConnectFilter> | undefined = this.connectFilter.get(side)
    if (connectFilters == undefined) {
      return false
    }
    return connectFilters.filter((filter) => {
      return filter.getFilter(targetBlock)
    }).length > 0
  }

  private highlightSide(targetBlock: Block) {
    const side = this.calcDirection(targetBlock.center)
    if (this.canConnect(targetBlock)) {
      switch (side) {
        case Direction.UP:
          this.element.style.border = 'none'
          this.element.style.borderTop = '4px solid red'
          break
        case Direction.DOWN:
          this.element.style.border = 'none'
          this.element.style.borderBottom = '4px solid red'
          break
        case Direction.RIGHT:
          this.element.style.border = 'none'
          this.element.style.borderRight = '4px solid red'
          break
        case Direction.LEFT:
          this.element.style.border = 'none'
          this.element.style.borderLeft = '4px solid red'
          break
      }
    }
  }

  /** ブロックを接続します */
  private connect(block: Block) {
    const side = this.calcDirection(block.center)
    if (this.canConnect(block)) {
      block.setPosition(this.connectBlockPoint(side, block))
    }
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
  }

  private onMouseMove = (event: MouseEvent) => {
    const blockX = this.dragStartBlockX + (event.x - this.dragStartCursorX)
    const blockY = this.dragStartBlockY + (event.y - this.dragStartCursorY)
    this.setPosition(new Vec2(blockX, blockY))

    blockStore.blocks.forEach((block) => {
      block.element.style.border = 'none'
    })
    const nearestBlock = blockStore.getMinimumDistanceBlock(this)
    if (nearestBlock != null && nearestBlock.center.distance(this.center) <= 200) {
      nearestBlock.highlightSide(this)
    }
  }

  private onMouseUp = () => {
    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mouseup', this.onMouseUp)

    const nearestBlock = blockStore.getMinimumDistanceBlock(this)
    if (nearestBlock != null && nearestBlock.center.distance(this.center) <= 200) {
      nearestBlock.connect(this)

      // あまり良い設計ではないが, 下側に接続できたとき, それを親子関係とする
      const side = nearestBlock.calcDirection(this.center)
      if (side === Direction.DOWN) {
        this.prev = nearestBlock
        nearestBlock.next = this
      }
    }

    blockStore.blocks.forEach((block) => {
      block.element.style.border = 'none'
    })
  }
}
