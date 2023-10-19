import {Vec2} from "../types/Vec2";

export interface IBlockPosition {
  x: number
  y: number
  width: number
  height: number

  center(): Vec2
}

export class BlockPosition implements IBlockPosition {
  height: number;
  width: number;
  x: number;
  y: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  center(): Vec2 {
    return new Vec2(this.x + this.width / 2, this.y + this.height / 2)
  }
}
