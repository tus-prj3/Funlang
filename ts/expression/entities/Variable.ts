export class Variable {
  name: string
  value: number | boolean

  constructor(name: string, value: number | boolean) {
    this.name = name
    this.value = value
  }
}