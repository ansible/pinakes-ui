# Pinakes UI
[![Dist release](https://github.com/ansible/pinakes-ui/actions/workflows/dist-release.yml/badge.svg)](https://github.com/ansible/pinakes-ui/actions/workflows/dist-release.yml)

## Running the standalone Pinakes UI
1. Clone the [Pinakes](https://github.com/ansible/pinakes) repo and follow the instructions for starting up the API.
2. Install node
3. `npm install`
4. `npm run start:standalone`


## Building the Pinakes UI for use with Pinakes

This is useful if you would like to build the UI with custom images within `src/assets/images` (override these images before executing these build steps):

First, our Approval UI is currently a separate repository. We are working on integrating this repository into pinakes-ui, so these steps will change to no longer include mentions of approval-ui in the near future.

Ensure you are in the top level directory of the pinakes-ui project.
`git clone https://github.com/RedHatInsights/approval-ui.git`

```
npm ci || npm install
npm run build:standalone
cd ./approval-ui
npm ci || npm install
npm run build:standalone
cd ..
cp -r ./approval-ui/dist ./dist/approval
tar -C dist/ -czvf catalog-ui.tar.gz .
```


## License

This project is available as open source under the terms of the [Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0).
