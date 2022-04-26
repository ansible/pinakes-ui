# Pinakes UI
[![Dist release](https://github.com/ansible/pinakes-ui/actions/workflows/dist-release.yml/badge.svg)](https://github.com/ansible/pinakes-ui/actions/workflows/dist-release.yml)

## Running the standalone Pinakes UI
1. Clone the [Pinakes](https://github.com/ansible/pinakes) repo and follow the instructions for starting up the API.
2. Install node
3. `npm install`
4. `npm run start:standalone`


## Building the Pinakes UI for use with Pinakes

This is useful if you would like to build the UI with custom images within `src/assets/images` (override these images before executing these build steps):

```
npm ci || npm install
npm run build:standalone
cd ..
tar -C dist/ -czvf catalog-ui.tar.gz .
```


## License

This project is available as open source under the terms of the [Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0).
