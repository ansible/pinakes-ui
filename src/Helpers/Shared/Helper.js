import React from 'react';

export function bindMethods (context, methods) {
  methods.forEach(method => {
    context[method] = context[method].bind(context);
  });
};


