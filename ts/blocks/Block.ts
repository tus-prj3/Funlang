import {Direction} from "../consts/Direction";
import {Vec2} from "../consts/Vec2";

export class Block {
  private x: number
  private y: number
  private width: number
  private height: number
  private identifier: string

  private readonly element: HTMLElement

  private neighbor: [Direction, Block][]

  // ドラッグ開始時のブロック位置
  private dragStartBlockX: number = 0
  private dragStartBlockY: number = 0
  private dragStartCursorX: number = 0
  private dragStartCursorY: number = 0

  constructor(x: number, y: number, width: number, height: number, identifier: string, appendClass: string = 'simple_block') {
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

  public get center(): Vec2 {
    return new Vec2(this.x + this.width / 2, this.y + this.height / 2)
  }

  /** このブロックから見て指定された座標がどの方向にあるかを返します */
  public calcDirection(x: number, y: number): Direction {
    const angle = this.center.angle(new Vec2(x, y))
    if (45 <= angle && angle < 135) {
      return Direction.UP
    } else if (135 <= angle && angle < 215) {
      return Direction.LEFT
    } else if (215 <= angle && angle < 305) {
      return Direction.DOWN
    }
    return Direction.RIGHT
  }

  private setPosition(x: number, y: number) {
    this.x = x
    this.y = y
    this.element.style.left = x + "px"
    this.element.style.top = y + "px"
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
    this.setPosition(blockX, blockY)
  }

  private onMouseUp = () => {
    console.info(this.calcDirection(100, 100))
    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mouseup', this.onMouseUp)
  }
}
