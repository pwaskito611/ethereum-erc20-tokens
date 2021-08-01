pragma solidity ^0.6.2;

import "./Crowdesale.sol";
import "./KycContract.sol";

contract MyTokenSale is Crowdsale {

    KycContract kyc;

    constructor(
        uint256 rate,    // rate in TKNbits
        address payable wallet,
        IERC20 token,
        KycContract _kyc
    )
        Crowdsale(rate, wallet, token)
        public
    {
        kyc = _kyc;
    } 

    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal view override(Crowdsale) {
        super._postValidatePurchase(beneficiary, weiAmount);
        require(kyc.KycCompleted(msg.sender), "KYC not completed, purchase not allowed");    
    }
}