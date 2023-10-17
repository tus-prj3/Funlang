export class Block {
  private x: number
  private y: number
  private width: number
  private height: number
  private identifier: string

  private readonly element: HTMLElement

  private parent: Block | null
  private children: Block[]

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

    this.parent = null
    this.children = []

    this.element = document.createElement("div")
    this.element.style.left = x + "px"
    this.element.style.top = y + "px"
    this.element.style.width = width + "px"
    this.element.style.height = height + "px"
    this.element.className = appendClass

    this.element.onmousedown = this.onMouseDown
    document.getElementById('workspace')?.appendChild(this.element)
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
    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mouseup', this.onMouseUp)
  }

  private repaint = () => {
    this.element.style.left = this.x + "px";
    this.element.style.top = this.y + "px";
  }
}
