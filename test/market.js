const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Market", function () {
  let usdt, market, myNft, account1, account2;
  let baseURI = "https://sameple.com/";

  beforeEach(async () => {
    [account1, account2] = await ethers.getSigners();
    const USDT = await ethers.getContractFactory("cUSDT");
    usdt = await USDT.deploy();
    const MyNFT = await ethers.getContractFactory("MyNFT");
    myNft = await MyNFT.deploy();
    const Market = await ethers.getContractFactory("Market");
    market = await Market.deploy(usdt.target, myNft.target);

    await myNft.safeMint(account1.address, baseURI + "0");
    await myNft.safeMint(account1.address, baseURI + "1");
    await myNft.approve(market.target, 0);
    await myNft.approve(market.target, 1);
    await usdt.transfer(account2.address, "10000000000000000000000");
    await usdt.connect(account2).approve(market.target, "1000000000000000000000000");
  });

  it('its erc20 address should be usdt', async function() {
    expect(await market.erc20()).to.equal(usdt.target);
  });

  it('its erc721 address should be myNft', async function() {
    expect(await market.erc721()).to.equal(myNft.target);
  });

  it('account1 should have 2 nfts', async function() {
    expect(await myNft.balanceOf(account1.address)).to.equal(2);
  });

  it('account2 should have 10000 USDT', async function() {
    expect(await usdt.balanceOf(account2.address)).to.equal("10000000000000000000000");
  });

  it('account2 should have 0 nfts', async function() {
    expect(await myNft.balanceOf(account2.address)).to.equal(0);
  });

  it('account1 can list two nfts to market', async function() {
    const price = "0x0000000000000000000000000000000000000000000000000001c6bf52634000";
    await market.connect(account1).list_nft_to_market(
      myNft,
      0,
      price
    )
    await market.connect(account1).list_nft_to_market(
      myNft,
      1,
      price
    )

    expect((await market.NFTs(0))[3]).to.equal(true);
    expect((await market.NFTs(1))[3]).to.equal(true);
  })

  it('account1 can unlist one nft from market', async function() {
    const price = "0x0000000000000000000000000000000000000000000000000001c6bf52634000";
    await market.connect(account1).list_nft_to_market(
      myNft,
      0,
      price
    )
    await market.connect(account1).list_nft_to_market(
      myNft,
      1,
      price
    )

    expect((await market.NFTs(1))[3]).to.equal(true);

    await market.connect(account1).unlist_nft_from_market(1)

    expect((await market.NFTs(1))[3]).to.equal(false);
  })

  it('account1 can change price of nft from market', async function() {
    const price = "0x0000000000000000000000000000000000000000000000000001c6bf52634000";
    await market.connect(account1).list_nft_to_market(
      myNft,
      0,
      price
    )
    await market.connect(account1).list_nft_to_market(
      myNft,
      1,
      price
    )
    await market.connect(account1).change_nft_price(1, 123456789)
    
    expect((await market.NFTs(1))[2]).to.equal(123456789);
  })

  it('account2 can buy nft from market', async function() {
    const price = "0x0000000000000000000000000000000000000000000000000001c6bf52634000";
    await market.connect(account1).list_nft_to_market(
      myNft,
      0,
      price
    )
    await market.connect(account1).list_nft_to_market(
      myNft,
      1,
      price
    )
    await market.connect(account2).buy_nft(1, { value: ethers.parseUnits('500000000000000', 'wei') })

    expect(await myNft.ownerOf(1)).to.equal(account2.address);
  })
})