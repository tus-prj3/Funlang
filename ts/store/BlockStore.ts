// noinspection all
import { Block } from "../block/base/internal";
import {IBlockPosition} from "../interface/IBlockPosition";
import {IStatement} from "../expression/interface/INode";
import {FProgram} from "../expression/FNode";

export class BlockStore {
  blocks: Block[] = []

  public getMinimumDistanceBlock(block: Block): Block | null {
    return getMinimumDistBlock(this.blocks, block)
  }

  public getAst() {
    const roots = this.blocks.filter((block) => !block.hasPrev && !block.hasParent)

    let body: IStatement[] = []
    roots.forEach((block) => {
      let nowBlock: Block | null = block
      while (nowBlock != null) {
        body.push(nowBlock.getExpression())
        nowBlock = nowBlock.getNext
      }
    })
    return new FProgram(body)
  }

  public validate() {
    return this.blocks.map((block) => {
      console.info(`Block named ${block.identifier}: ${block.validate()}`)
      return block.validate()
    }).filter((bool) => !bool).length == 0
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