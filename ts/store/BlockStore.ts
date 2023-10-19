import { Block } from "../block/Block";

export class BlockStore {
  blocks: Block[] = []

  public getMinimumDistanceBlock(block: Block): Block | null {
    const targetBlocks = this.blocks.filter((bl) => bl.getIdentifier != block.getIdentifier)
    if (targetBlocks.length == 0) {
      return null
    } else {
      let resultBlock: Block | null = null
      let minimumDistance = Infinity
      for (let i = 0; i < targetBlocks.length; i++) {
        const distance = targetBlocks[i].center.distance(block.center)
        if (distance < minimumDistance) {
          minimumDistance = distance
          resultBlock = targetBlocks[i]
        }
      }
      return resultBlock
    }
  }
}

