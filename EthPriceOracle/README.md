# Setup

## Install all node package

```ruby
npm init -y
npm i truffle openzeppelin-solidity loom-js loom-truffle-provider bn.js axios
```

## Create oracle directory

```ruby
mkdir oracle && cd oracle && npx truffle init && cd ..
```

## Create caller directory

```ruby
mkdir caller && cd caller && npx truffle init && cd ..
```

## Generate private key for oracle and caller contract

```ruby
cd ./EthPriceOracle
node scripts/gen-key.js oracle/oracle_private_key 
node scripts/gen-key.js caller/caller_private_key
```

## Create the migration files

create file **./oracle/migrations/2_eth_price_oracle.js** and **./caller/migrations/02_caller_contract.js**

## Deploy

```ruby
npm run deploy:all 
```

## Test

```ruby
node Client.js
```