// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

// import "@openzeppelin/contracts/interfaces/IERC721Receiver.sol"; 
import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";

contract Market {
    IERC20 public erc20;
    IERC721 public erc721;

    struct NFT {
        IERC721 nft_address;
        uint256 token_id;
        uint256 price;
        bool isList;
        bool isBought; 
    }

    uint256 public order_id;
    mapping(uint256 => NFT) public NFTs; 

    constructor(IERC20 _erc20, IERC721 _erc721) {
        erc20 = _erc20;
        erc721 = _erc721;
    }

    function list_nft_to_market(
        IERC721 _nft,
        uint256 _token_id,
        uint256 _price
    ) public {
        require(
            _nft.ownerOf(_token_id) == msg.sender, 
            "u r not the owner of the nft"
        );
        require(_nft.getApproved(_token_id) == address(this), "u have not approve the token to the market");

        NFT memory nft;
        nft.nft_address = _nft;
        nft.token_id = _token_id;
        nft.price = _price;
        nft.isList = true;

        NFTs[order_id] = nft;

        order_id++;

    }

    function unlist_nft_from_market(uint256 _order_id) external {
        require(
            NFTs[_order_id].nft_address.ownerOf(NFTs[_order_id].token_id) == msg.sender, 
            "u r not the owner of the nft"
        );
        NFTs[_order_id].isList = false;
    }

    function change_nft_price(uint256 _order_id, uint256 _price) external {
        require(
            NFTs[_order_id].nft_address.ownerOf(NFTs[_order_id].token_id) == msg.sender, 
            "u r not the owner of the nft"
        );
        NFTs[_order_id].price = _price;
    }

    function buy_nft(uint256 _order_id) external payable{
        require(msg.value >= NFTs[_order_id].price, "not enough money to buy the nft");
        require(NFTs[_order_id].isBought == false, "the nft has been bought");

        address owner = NFTs[_order_id].nft_address.ownerOf(NFTs[_order_id].token_id);
        NFTs[_order_id].nft_address.transferFrom(owner, msg.sender, NFTs[_order_id].token_id);
        payable(owner).transfer(NFTs[_order_id].price);

        NFTs[_order_id].isBought = true;
    }

    receive() external payable{}
}