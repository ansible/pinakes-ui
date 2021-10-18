interface Auth {
  getUser: () => Promise<any>;
}

interface Chrome {
  auth: Auth;
  isBeta: () => boolean;
  appNavClick: (target: { id: string; secondaryNav?: boolean }) => void;
}

interface Insights {
  chrome: Chrome;
}

interface Catalog {
  token: string;
  standalone: boolean;
}

/**
 * Global window interface does not have to be exported and referenced anywhere
 */
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
interface Window {
  catalog: Catalog;
  insights: Insights;
}
