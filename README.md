# BeautifulSearch Solr Admin Client

The NPM package to connect to a solr instance.


## Local development and contribution

To learn more about building an NPM package and how to work with it in a local environement. Refer this article:
https://dev.to/therealdanvega/creating-your-first-npm-package-2ehf


## Installation

```
npm install https://github.com/beautifulsearch/solr-admin-client
# or
yarn add https://github.com/beautifulsearch/solr-admin-client
````


## Usage

```
import Solr from 'solr-admin-client';

const solrUrl = "localhost:8983";
const core = "gettingstarted";
const solr = new Solr(solrUrl, core);

// to get the status of the specific core
solr.getStatus()
```
