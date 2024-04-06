// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

contract DripCaster is Ownable {
    constructor(address platformOwner) Ownable(platformOwner) {}

    struct Drips {
        address creator;
        address productAddress;
        string productName;
        string productDataURI;
        string previewImageURI;
        string[] discountedCommunities;
        bool finiteSupply;
        uint256 supply;
        uint256 price;
    }

    // mappings 
    mapping(address => Drips[]) dripsWarehouse; // creator => product

    // events
    event DripsCreated(address indexed creator, address product);


    function createDrip(
        address _productOwner,
        string memory _productName,
        string memory _productDataURI,
        string memory _previewImageURI,
        uint256 _price,
        bool _finiteSupply,
        uint256 _supply, 
        string[] memory _discountedCommunities
    ) public {
        

        DripsContract product = new DripsContract(
            _productOwner,
            _productDataURI,
            _previewImageURI,
            _finiteSupply,
            _supply,
            _price,
            _discountedCommunities
        );

        Drips memory newProduct = Drips({
            creator: _productOwner,
            productAddress: address(product),
            productName: _productName,
            productDataURI: _productDataURI,
            previewImageURI: _previewImageURI,
            price: _price,
            finiteSupply: _finiteSupply,
            supply: _supply,
            discountedCommunities: _discountedCommunities
        });

        dripsWarehouse[_productOwner].push(newProduct);

        emit DripsCreated(_productOwner, address(product));

    }

    function getProducts(address _creator) public view returns (Drips[] memory) {
        return dripsWarehouse[_creator];
    }

    function getProduct(uint256 index) public view returns (Drips memory) {
        return dripsWarehouse[msg.sender][index];
    }

    function getProductsCount(address _creator) public view returns (uint256) {
        return dripsWarehouse[_creator].length;
    }

}


contract DripsContract is ERC1155, Ownable, ERC1155Pausable, ERC1155Burnable, ERC1155Supply {

    uint256 public soldUnits = 0;
    uint256 public price = 0 ether;
    uint256 public revenueGenerated = 0;

    bool public finiteSupply = false;
    uint256 public initialSupply = 0;
    string public previewImageURI;
    string public dataURI;
    string[] public discountedCommunities;


    constructor(
        address _productOwner, 
        string memory _dataURI, 
        string memory _previewImageURI, 
        bool _finiteSupply, 
        uint256 _initialSupply, 
        uint256 _price,
        string[] memory _discountedCommunities
    )
        ERC1155(_previewImageURI)
        Ownable(_productOwner)
    {
        price = _price;
        finiteSupply = _finiteSupply;
        initialSupply = _initialSupply;
        previewImageURI = _previewImageURI;
        dataURI = _dataURI;
        discountedCommunities = _discountedCommunities;
    }

    

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address account)
        public
        payable
    {
        require(msg.value == price, "Insufficient funds");

        // transfer the funds to the owner
        payable(owner()).transfer(msg.value);

        soldUnits+=1;

        revenueGenerated+= price;

        // mint the token
        _mint(account, 1, 1, "0x00");
    }

    function discountedMint(address _account, uint256 _discountPercentage) 
        public
        payable
    {
        // calculate the discounted price
        uint256 discountedPrice = (price * _discountPercentage) / 100;
        // take the discounted price from the user and transfer it to the owner
        // send the rest back to the user
        require(msg.value >= discountedPrice, "Insufficient funds");

        // transfer the funds to the owner
        payable(owner()).transfer(discountedPrice);

        soldUnits+=1;

        // transfer the rest back to the user
        payable(_account).transfer(msg.value - discountedPrice);

        revenueGenerated+= discountedPrice;

        // mint the token
        _mint(_account, 1, 1, "0x00");

        

    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
    }

    // The following functions are overrides required by Solidity.

    function _update(address from, address to, uint256[] memory ids, uint256[] memory values)
        internal
        override(ERC1155, ERC1155Pausable, ERC1155Supply)
    {
        super._update(from, to, ids, values);
    }
}
