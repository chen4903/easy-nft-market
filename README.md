This is a simple nft market implementation.
the ERC20 and ERC721 is built by Openzeppelin wizard.

How to run the test?
1. git clone the repo and `cd` to the project
2. `npx i -D`
3. `npx hardhat test`

and the result is like this:

```
Market
    ✔ its erc20 address should be usdt
    ✔ its erc721 address should be myNft
    ✔ account1 should have 2 nfts
    ✔ account2 should have 10000 USDT
    ✔ account2 should have 0 nfts
    ✔ account1 can list two nfts to market (52ms)
    ✔ account1 can unlist one nft from market (55ms)
    ✔ account1 can change price of nft from market (39ms)
    ✔ account2 can buy nft from market (56ms)


  9 passing (3s)
```

