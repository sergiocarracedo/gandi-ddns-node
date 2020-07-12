This tool, written in NodeJS, is a dynamic DNS updater for Gandi. It uses LiveDNS REST API to update the zone for a subdomain of a domain to point at the external IPv4 address of the computer it has been run from.

Highly inspirated by https://github.com/cavebeat/gandi-live-dns


## Install

For global install

```
yarn global add gandi-ddns-node
```

For local install

* Clone this repo
* Copy `.env.example` to `.env`
* Edit `.env` with your configuration
* Install node dependencies with `yarn` or `npm install`
* (optional) Add to ENV if you want to use from enywhere `export PATH=[PATH_TO_THIS]/bin:$PATH`

## Usage

* Run script with `gandi-ddns` or `[PATH_TO_THIS]/bin/gandi-ddns`

If you don't set arguments config values are gotten from .env file

```shell script
$ gandi-ddns --api-key [apiKey] --api-base [apiBase] --domain [domain] --subdomain [subdomain] --ttl [ttl] -- ip-provider [ip-provider] 
```

### Options

#### Verbose

```shell script
$ gandi-ddns -v
# or
$ gandi-ddns --v
```
#### Force

Force to update even if current local IP is the same as domain IP

```shell script
$ gandi-ddns -force
# or
$ gandi-ddns --force
```

#### --api-key | env API_KEY

Get your Production API key in https://account.gandi.net/ > Security section

#### --api-base | env API_BASE

Gandi api base, default `https://dns.api.gandi.net/api/v5`

#### --api-domain | env DOMAIN

Your domain

#### --api-subdomain | env SUBDOMAIN

Your subdomain (or a list of comma separated subdomains) to update. For main domain you should use `@` 

#### --api-ttl | env TTL

Time To Live of the IP, default `300` 

#### --ip-provider | env IP_PROVIDER

Ip provider to get current local IP, default `https://ifconfig.co/ip` the provider url must return just the IP

#### --ip
Ip to set instead of get from provider


