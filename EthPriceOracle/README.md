# Setup

## Generate private key for oracle and caller contract

### Command line

```ruby
cd ./EthPriceOracle
node scripts/gen-key.js oracle/oracle_private_key 
node scripts/gen-key.js caller/caller_private_key
```

## Create the migration files
create file *./oracle/migrations/2_eth_price_oracle.js* and *./caller/migrations/02_caller_contract.js*

## Deploy

```ruby
npm run deploy:all 
```

## Test

```ruby
node Client.js
```
