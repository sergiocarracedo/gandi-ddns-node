This tool, written in NodeJS, is a dynamic DNS updater for Gandi. It uses LiveDNS REST API to update the zone for a subdomain of a domain to point at the external IPv4 address of the computer it has been run from.



Highly inspirated by https://github.com/cavebeat/gandi-live-dns



## Usage

```shell script
$ gandi-ddn
```

If you don't set arguments config values are getted from .env file

```shell script
$ gandi-ddn --api-key [apiKey] --api-base [apiBase] --domain [domain] --subdomain [subdomain] --ttl [ttl] -- ip-provider [ip-provider] 
```

### Options

#### Verbose

```shell script
$ gandi-ddn -v
# or
$ gandi-ddn --v
```
#### Force

Force to update even if current local IP is the same as domain IP

```shell script
$ gandi-ddn -force
# or
$ gandi-ddn --force
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
