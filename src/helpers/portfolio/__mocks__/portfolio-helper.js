export function fetchPortfolioByName(name = '') {
  return new Promise((res) => {
    if (name === 'should-conflict') {
      return res({
        data: [{ name: 'should-conflict', id: 'conflict-id' }]
      });
    }

    return res({
      data: [],
      meta: { count: 0 }
    });
  });
}
