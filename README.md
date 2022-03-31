# Pinakes UI
[![Dist release](https://github.com/ansible/pinakes-ui/actions/workflows/dist-release.yml/badge.svg)](https://github.com/ansible/pinakes-ui/actions/workflows/dist-release.yml)

## Running locally
Have [insights-proxy](https://github.com/RedHatInsights/insights-proxy) installed under PROXY_PATH

```shell
SPANDX_CONFIG="profiles/local-frontends.js" bash ../insights-proxy/scripts/run.sh
```

## Running the standalone Pinakes UI 
1. Clone the [Pinakes](https://github.com/ansible/pinakes) repo and follow the instructions for starting up the API.
2. Install node
3. `npm install`
4. `npm run start:standalone`


## License

This project is available as open source under the terms of the [Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0).
