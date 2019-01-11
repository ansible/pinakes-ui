import { getUserApi } from '../Shared/userLogin';

const userApi = getUserApi();

export function listPortfolios() {
  return userApi.listPortfolios().then(data => data, error => console.error(error));
}

export function getPortfolioItems() {
  return listPortfolioItems();
}

export function listPortfolioItems() {
  return userApi.listPortfolioItems().then(data => data, error => console.error(error));
}

export function getPortfolioItem(portfolioId, portfolioItemId) {
  return userApi.fetchPortfolioItemFromPortfolio(portfolioId, portfolioItemId)
  .then(data => data, error => console.error(error));
}

export function getPortfolio(portfolioId) {
  return userApi.fetchPortfolioWithId(portfolioId).then(data => data, error => console.error(error));
}

export function getPortfolioItemsWithPortfolio(portfolioId) {
  return userApi.fetchPortfolioItemsWithPortfolio(portfolioId)
  .then(data => data, error => console.error(error));
}

// TO DO - change to use the API call that adds multiple items to a portfolio when available
export async function addPortfolio(portfolioData, items) {
  let portfolio = await userApi.addPortfolio(portfolioData);
  if (!portfolio)
  {return portfolio;}

  if (items && items.length > 0) {
    return addToPortfolio(portfolio, items);
  }
}

export async function addToPortfolio(portfolioId, items) {
  let idx = 0; let newItem = null;

  for (idx = 0; idx < items.length; idx++) {
    newItem = await userApi.addPortfolioItem (JSON.stringify ({ service_offering_ref: items[idx] }));
    if (newItem) {
      await userApi.addPortfolioItemToPortfolio(portfolioId, JSON.stringify({ portfolio_item_id: newItem.id }));
    }
  }

  return newItem;
}

export async function updatePortfolio(portfolioData) {
  return userApi.updatePortfolio(portfolioData).then(() => {
    console.log('Update Portfolio Called successfully.');
  }, (error) => {
    window.console.error(error);
  });
}

export async function removePortfolio(portfolioId) {
  return userApi.destroyPortfolio(portfolioId).then(() => {
    console.log('Remove Portfolio Called successfully.');
  });
}
