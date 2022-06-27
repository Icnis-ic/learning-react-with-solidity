// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract Bank {
    uint256 public totalsupply;
    mapping(address => uint256) balance;
    struct BankDetailList {
        address owner;
        string paytype;
        uint256 amount;
        uint256 timeStamp;
    }
    mapping(address => BankDetailList[]) yourHistory;

    BankDetailList[] public history;

    function deposit(uint256 amount) public payable {
        // require(msg.value == amount);
        balance[msg.sender] += amount;
        totalsupply += amount;
        BankDetailList memory data = BankDetailList(
            msg.sender,
            "deposit",
            amount,
            block.timestamp
        );
        history.push(data);
        yourHistory[msg.sender].push(data);
    }

    function withdraw(uint256 amount) public {
        require(amount <= balance[msg.sender]);
        balance[msg.sender] -= amount;
        totalsupply -= amount;
        BankDetailList memory data = BankDetailList(
            msg.sender,
            "withdraw",
            amount,
            block.timestamp
        );
        history.push(data);
        yourHistory[msg.sender].push(data);
        // payable(msg.sender).transfer(amount);
    }

    function getBalance() public view returns (uint256) {
        // return _balance;
        return balance[msg.sender];
    }

    function gethistory() external view returns (BankDetailList[] memory) {
        // return _balance;
        return history;
        // return yourHistory[msg.sender];
    }

    function getTotalSupply() public view returns (uint256) {
        // return _balance;
        return totalsupply;
    }
}
