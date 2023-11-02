/**
 * 関数の実態
 */
export abstract class Func {
  abstract name: string
  abstract invoke(arg: any): any
}

export class Println extends Func {
  name: string = 'println'

  invoke(arg: any): any {
    console.info(arg)
  }
}