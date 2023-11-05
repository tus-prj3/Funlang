export class ReturnNotifier {
  // return を行える状況かどうか
  canReturnable: boolean
  // return をしたことを呼び出し元に知らせるかどうか
  shouldNotifyReturnToCalledFrom: boolean

  constructor(canReturnable: boolean = false, shouldNotifyReturnToCalledFrom: boolean = false) {
    this.canReturnable = canReturnable
    this.shouldNotifyReturnToCalledFrom = shouldNotifyReturnToCalledFrom
  }
}