# Setup test

## Truffle

### Install

```ruby
npm instal truffle -g
truffle init
npm install truffle-hdwallet-provider
```

### Compile and Test

```ruby
truffle compile
truffle migrate --network rinkeby
truffle migrate --network loom_testnet
truffle migrate --network basechain
```

### Test

Run test with loom_testnet.

```ruby
truffle test --network loom_testnet. 
```

### Create a new private key

```ruby
./loom genkey -a mainnet_public_key -k mainnet_private_key
```

### Securely pass the private key to Truffle

```ruby
echo mainnet_private_key > .gitignore
```