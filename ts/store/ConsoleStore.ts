export class ConsoleStore {
  public static outputCount = 0

  public static out(value: any) {
    const console = document.getElementById('result_text_area')! as HTMLTextAreaElement
    console.value += `[output No.${ConsoleStore.outputCount}]: ${value}\n`
    ConsoleStore.outputCount++
  }
}