interface Auth {
  getUser: () => Promise<any>;
}

interface Chrome {
  auth: Auth;
}

interface Insights {
  chrome: Chrome;
}
/**
 * Global window interface does not have to be exported and referenced anywhere
 */
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
interface Window {
  insights: Insights;
}
