pragma solidity ^0.5.0;
import "./Token.sol";

contract FudiGo {
    string public name = "FudiGo";
    Token public token;
    uint public itemCount = 0;
    uint public orderCount = 0;
    mapping(address => mapping(uint => Item)) public items;
    mapping(address => uint) public counts;
    mapping(address => string) public names;
    mapping(address => uint) public tokenNumbers;

    struct Item {
        uint id;
        string name;
        uint price;
        address owner;
    }

    event ItemCreated(
        uint id,
        string name,
        uint price,
        address owner
    );

    event OrderPlaced(
        uint id,
        uint price,
        address indexed owner,
        address indexed spender,
        string items,
        uint number
    );

    constructor(Token _token) public {
    token = _token;
    }

    function createItem(string memory _name, uint _price) public {
        uint count;
        // Require a valid name
        require(bytes(_name).length > 0);
        // Require a valid price
        require(_price > 0);
        // Increment item count
        itemCount++;
        
        count = counts[msg.sender] + 1;
        counts[msg.sender] = count;
        // Create the product
        items[msg.sender][count] = Item(itemCount, _name, _price, msg.sender);
        // Trigger an event
        emit ItemCreated(itemCount, _name, _price, msg.sender);
    }

    function updateItem(string memory _name, uint _price, uint _id) public {
        itemCount++;
        items[msg.sender][_id] = Item(itemCount, _name, _price, msg.sender);   
    }
    
    function checkOut(address _id, uint _price, string memory _items) public returns (bool success){
        uint tokenNumber;
        // Increase order count
        orderCount++;
        // transfer amount
        token.externalPayment(msg.sender, _id, _price);
        // Get my order tokenNumber
        tokenNumber = tokenNumbers[_id] + 1;
        tokenNumbers[_id] = tokenNumber;
        // Trigger an event
        emit OrderPlaced(orderCount, _price, _id, msg.sender, _items, tokenNumber);
        return true;
    }

    function resetNumber() public {
        tokenNumbers[msg.sender] = 0;
    }

    function updateName(string memory _name) public {
        names[msg.sender] = _name;
    }
    
    function resetMenu() public {
        uint count = counts[msg.sender]; 
        for(uint i=1;i<= count;i++){
        delete items[msg.sender][i];
        itemCount--;
        }
        counts[msg.sender] = 0 ;
    }
}