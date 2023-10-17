import {Direction} from "../consts/Direction";
import {Vec2} from "../consts/Vec2";
import {getRandomColor} from "../consts/Color";
import {blockStore} from "../index";

export class Block {
  private x: number
  private y: number
  private readonly width: number
  private readonly height: number
  private readonly identifier: string

  private readonly element: HTMLElement

  private neighbor: [Direction, Block][]

  // ドラッグ開始時のブロック位置
  private dragStartBlockX: number = 0
  private dragStartBlockY: number = 0
  private dragStartCursorX: number = 0
  private dragStartCursorY: number = 0

  constructor(x: number, y: number, width: number, height: number, identifier: string, appendClass: string = 'block_without_color') {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.identifier = identifier

    this.neighbor = []

    this.element = document.createElement("div")
    this.element.style.left = x + "px"
    this.element.style.top = y + "px"
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
  public concatBlockPoint(dir: Direction, block: Block): Vec2 {
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

  private highlightSide(to: Vec2) {
    const side = this.calcDirection(to)
    switch (side) {
      case Direction.UP:
        this.element.style.border = 'none'
        this.element.style.borderTop = '4px solid red'
        break
      case Direction.RIGHT:
        this.element.style.border = 'none'
        this.element.style.borderRight = '4px solid red'
        break
      case Direction.DOWN:
        this.element.style.border = 'none'
        this.element.style.borderBottom = '4px solid red'
        break
      case Direction.LEFT:
        this.element.style.border = 'none'
        this.element.style.borderLeft = '4px solid red'
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

    this.neighbor.forEach(([_, block]) => {
      block.dragStartBlockX = block.x
      block.dragStartBlockY = block.y
    })

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
    if (nearestBlock != null) {
      nearestBlock.highlightSide(this.center)
    }
  }

  private onMouseUp = () => {
    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mouseup', this.onMouseUp)

    /*
    const aroundBlocks = blockStore.blocks.filter((block) => {
      return block.isInRange(130, this.center)
    })
    if (aroundBlocks.length != 0) {
      const concatBlock = aroundBlocks[0]
      const direction = concatBlock.calcDirection(this.center)
      this.neighbor.push(
        [direction, concatBlock]
      )
      this.setPosition(
        concatBlock.concatBlockPoint(direction, this)
      )
      blockStore.blocks = blockStore.blocks.filter((block) => block.identifier != concatBlock.identifier)
    }*/
    blockStore.blocks.forEach((block) => {
      block.element.style.border = 'none'
    })

    // console.info(blockStore.blocks)
  }
}
