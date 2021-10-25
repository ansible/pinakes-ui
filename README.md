# Insights Service Catalog UI

[![Build Status](https://travis-ci.org/RedHatInsights/catalog-ui.svg)](https://travis-ci.org/RedHatInsights/catalog-ui)
[![codecov](https://codecov.io/gh/RedHatInsights/catalog-ui/branch/master/graph/badge.svg)](https://codecov.io/gh/RedHatInsights/catalog-ui)

[![Build history for master branch](https://buildstats.info/travisci/chart/RedHatInsights/catalog-ui?branch=master&includeBuildsFromPullRequest=false&buildCount=50)](https://travis-ci.org/RedHatInsights/catalog-ui/branches)

## Getting Started
There is a [Dev Setup Wiki](https://gitlab.cloudforms.lab.eng.rdu2.redhat.com/insights/insights-ui-service_catalog/wikis/Dev-Setup) for setting up this Frontend.

## Running locally
Have [insights-proxy](https://github.com/RedHatInsights/insights-proxy) installed under PROXY_PATH

```shell
SPANDX_CONFIG="profiles/local-frontends.js" bash ../insights-proxy/scripts/run.sh
```

## Running the standalone catalog UI 
1. Clone the [ansible-catalog](https://github.com/ansible/ansible-catalog) repo and follow the instructions for starting up the API.
2. Install node
3. `npm install`
4. `npm run start:standalone`


## License

This project is available as open source under the terms of the [Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0).
