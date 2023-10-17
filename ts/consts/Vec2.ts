export class Vec2 {
  private x: number
  private y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  public get getX() {
    return this.x
  }

  public get getY() {
    return this.y
  }

  public setX(x: number) {
    this.x = x
  }

  public setY(y: number) {
    this.y = y
  }

  /**
   * この点から与えられた点までの角度(弧度法)を返します.
   * ただし, 角度は反時計回りを正として, 水平・右方向が0度となります.
   */
  public angle(to: Vec2): number {
    // TODO: This function maybe causes unexpected behavior when given the value such as dx == 0.
    const dx = to.getX - this.x
    const dy = to.getY - this.y

    if (dx < 0 && dy >= 0) {
      return Math.atan(dy / -dx) * 180 / Math.PI
    } else if (dx >= 0 && dy >= 0) {
      return 180 + (Math.atan(-dy / dx) * 180 / Math.PI)
    } else if (dx >= 0 && dy < 0) {
      return 180 + (Math.atan(-dy / dx) * 180 / Math.PI)
    }
    return 360 + Math.atan(dy / -dx) * 180 / Math.PI
  }
}
