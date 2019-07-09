export const toggleArraySelection = (items, item) => items.includes(item)
  ? [ ...items.slice(0, items.indexOf(item)), ...items.slice(items.indexOf(item) + 1) ]
  : [ ...items, item ];
