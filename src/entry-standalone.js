//Add redhat font to body
document.querySelector('body').classList.add('pf-m-redhat-font');
console.log('Debug - set standalone');
window.catalog = { standalone: true };
console.log('Debug - window.catalog', window.catalog);
import('./bootstrap-standalone');
