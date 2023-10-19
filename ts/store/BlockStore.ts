// noinspection all
import { Block } from "../block/internal";
import {IBlockPosition} from "../interface/IBlockPosition";

export class BlockStore {
  blocks: Block[] = []

  public getMinimumDistanceBlock(block: Block): Block | null {
    return getMinimumDistBlock(this.blocks, block)
  }
}

export function getMinimumDistBlock<T extends IBlockPosition>(blocks: T[], target: T): T | null {
  const targetBlocks = blocks.filter((bl) => bl !== target)
  if (targetBlocks.length == 0) {
    return null
  } else {
    let resultBlock: T | null = null
    let minimumDistance = Infinity
    for (let i = 0; i < targetBlocks.length; i++) {
      const distance = targetBlocks[i].center().distance(target.center())
      if (distance < minimumDistance) {
        minimumDistance = distance
        resultBlock = targetBlocks[i]
      }
    }
    return resultBlock
  }
}

