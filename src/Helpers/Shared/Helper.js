// No need with transform class properties
export function bindMethods (context, methods) {
  methods.forEach(method => {
    context[method] = context[method].bind(context);
  });
}

// ????
export function consoleLog (messages) {
  if (process.env.NODE_ENV === 'development') {
    window.console.log(messages);
  }
}
