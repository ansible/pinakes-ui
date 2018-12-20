// ????
export function consoleLog (messages) {
  if (process.env.NODE_ENV === 'development') {
    window.console.log(messages);
  }
}
