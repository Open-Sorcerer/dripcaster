// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";


contract Factory {
    // Returns the address of the newly deployed contract
    function deploy(bytes32 _salt, address _platformOwner)
        public
        payable
        returns (address)
    {
        // This syntax is a newer way to invoke create2 without assembly, you just need to pass salt
        // https://docs.soliditylang.org/en/latest/control-structures.html#salted-contract-creations-create2
        return address(new Pod{salt: _salt}(_platformOwner));
    }
}

contract Pod is Ownable {
    constructor(address platformOwner) Ownable(platformOwner) {}

    struct Product {
        address creator;
        address productAddress;
        string productName;
        string productDataURI;
        string previewImageURI;
        uint256 price;
        bool finiteSupply;
        uint256 supply;
    }

    // mappings 
    mapping(address => Product[]) productWarehouse; // creator => product

    // events
    event ProductCreated(address indexed creator, address product);


    function createProduct(
        address _productOwner,
        string memory _productName,
        string memory _productDataURI,
        string memory _previewImageURI,
        uint256 _price,
        bool _finiteSupply,
        uint256 _supply
    ) public {
        

        Peas product = new Peas(
            _productOwner,
            _productDataURI,
            _previewImageURI,
            _finiteSupply,
            _supply,
            _price
        );

        Product memory newProduct = Product({
            creator: _productOwner,
            productAddress: address(product),
            productName: _productName,
            productDataURI: _productDataURI,
            previewImageURI: _previewImageURI,
            price: _price,
            finiteSupply: _finiteSupply,
            supply: _supply
        });

        productWarehouse[_productOwner].push(newProduct);

        emit ProductCreated(_productOwner, address(product));

    }

    function getProducts(address _creator) public view returns (Product[] memory) {
        return productWarehouse[_creator];
    }

    function getProduct(uint256 index) public view returns (Product memory) {
        return productWarehouse[msg.sender][index];
    }

    function getProductsCount(address _creator) public view returns (uint256) {
        return productWarehouse[_creator].length;
    }

}


contract Peas is ERC1155, Ownable, ERC1155Pausable, ERC1155Burnable, ERC1155Supply {


    uint256 public soldUnits = 0;
    uint256 public price = 0 ether;
    uint256 public revenueGenerated = 0;

    bool public finiteSupply = false;
    uint256 public initialSupply = 0;
    string public previewImageURI;
    string public dataURI;


    constructor(
        address _productOwner, 
        string memory _dataURI, 
        string memory _previewImageURI, 
        bool _finiteSupply, 
        uint256 _initialSupply, 
        uint256 _price
    )
        ERC1155(_previewImageURI)
        Ownable(_productOwner)
    {
        price = _price;
        finiteSupply = _finiteSupply;
        initialSupply = _initialSupply;
        previewImageURI = _previewImageURI;
        dataURI = _dataURI;
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
