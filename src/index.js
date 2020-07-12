const chalk = require('chalk')
const dotenv = require('dotenv').config()
const argv = require('minimist')(process.argv.slice(2))
const request = require('sync-request')


function getCurrentIp (ipProvider) {
  return request('GET', ipProvider).getBody('utf8').trim()
}

function getDomainUUID (apiKey, apiBase, domain) {
  const endpoint = `${apiBase}/domains/${domain}`
  const res = JSON.parse(request('GET', endpoint, {
    headers: {
      'X-Api-Key': apiKey
    }
  }).getBody('utf8'))

  return res.zone_uuid
}

function getCurrentGandiIp (apiKey, apiBase, uuid, subdomain) {
  const endpoint = `${apiBase}/zones/${uuid}/records/${subdomain}/A`
  const res = JSON.parse(request('GET', endpoint, {
    headers: {
      'X-Api-Key': apiKey
    }
  }).getBody('utf8'))

  return res.rrset_values[0]
}

function updateRecords(apiKey, apiBase, uuid, subdomain, ip, ttl) {
  const endpoint = `${apiBase}/zones/${uuid}/records/${subdomain}/A`
  const payload = {
    rrset_ttl: ttl,
    rrset_values: [ip]
  }

  const res = JSON.parse(request('PUT', endpoint, {
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': apiKey
    },
    json: payload
  }).getBody('utf8'))

  return res
}


function main (apiKey, apiBase, domain, subdomains, ttl, ipProvider, ip, force, verbose) {
  subdomains = subdomains
    .split(',')
    .map(subdomain => subdomain.trim())

  // Get current IP
  if (!ip) {
    try {
      ip = getCurrentIp(ipProvider)
      if (verbose) {
        console.log(chalk.green(`Local current IP ${ip}`))
      }
    } catch (e) {
      console.log(chalk.red('Error retrieving IP from provider:'))
      console.log(chalk.red(`   Error code: ${e.statusCode}`))
      if (verbose) {
        console.log(chalk.red(`   Error message: ${e.message}`))
      }
      process.exit(1)
    }
  } else {
  if (verbose) {
    console.log(chalk.green(`Using ${ip} as local IP`))
  }
}

  // Get Gandi domain UUID
  let domainUUID
  try {
    domainUUID = getDomainUUID(apiKey, apiBase, domain)
  } catch (e) {
    console.log(chalk.red('Error retrieving domain UUID from Gandi'))
    console.log(chalk.red(`   Error code: ${e.statusCode}`))
    if (verbose) {
      console.log(chalk.red(`   Error message: ${e.message}`))
    }
    process.exit(1)
  }

  // Get Gandi subdomain current IP
  let currentGandiIp
  if (!force) {
    try {
      currentGandiIp = getCurrentGandiIp(apiKey, apiBase, domainUUID, subdomains[0])
    } catch (e) {
      console.log(chalk.red('Error retrieving current ip from Gandi'))
      console.log(chalk.red(`   Error code: ${e.statusCode}`))
      if (verbose) {
        console.log(chalk.red(`   Error message: ${e.message}`))
      }
      process.exit(1)
    }
  }

  if (force || ip !== currentGandiIp) {
    subdomains.forEach(subdomain => {
      try {
        updateRecords(apiKey, apiBase, domainUUID, subdomain, ip, ttl)
        if (verbose) {
          console.log(chalk.green(`Update subdomain ${subdomain} done`))
        }
      } catch (e) {
        console.log(chalk.red(`Error updating records for subdomain ${subdomain}`))
        console.log(chalk.red(`   Error code: ${e.statusCode}`))
        if (verbose) {
          console.log(chalk.red(`   Error message: ${e.message}`))
        }
      }
    })
    if (verbose) {
      console.log(chalk.green('Done!'))
    }
  } else {
    if (verbose) {
      console.log(chalk.yellow('IP not changed. Done!'))
    }
  }


}

module.exports = () => {
  main(
    argv['api-key'] || process.env.API_KEY,
  argv['api-base'] || process.env.API_BASE || 'https://dns.api.gandi.net/api/v5',
    argv.domain || process.env.DOMAIN,
    argv.subdomain || process.env.SUBDOMAIN,
    argv.ttl || process.env.TTL || 300,
    argv['ip-provider'] || process.env.IP_PROVIDER || 'https://ifconfig.co/ip',
    argv['ip'] || null,
    argv['force'] || false,
    argv['v'] || false
  )
}


