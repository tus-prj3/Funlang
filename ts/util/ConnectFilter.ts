import {Block} from "../block/Block";
import {Direction} from "../consts/Direction";

export class ConnectFilter {
  filter: (_: Block) => boolean

  constructor(filter: (_: Block) => boolean) {
    this.filter = filter
  }

  public get getFilter() {
    return this.filter
  }
}

export const ALL_CONNECT: Map<Direction, Array<ConnectFilter>> = new Map([
  [Direction.RIGHT, [new ConnectFilter((_) => true)]],
  [Direction.DOWN, [new ConnectFilter((_) => true)]]
])

export const NEXT_CONNECT: Map<Direction, Array<ConnectFilter>> = new Map([
  [Direction.DOWN, [new ConnectFilter((_) => true)]]
])

