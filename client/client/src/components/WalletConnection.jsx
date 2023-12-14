import React from 'react'
import Web3 from 'web3';
import ABI from './ABI.json';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types'
import '../css/wallet.css'

const WalletConnection = ({saveState}) => {
    const navigate = useNavigate();
    const connectWallet = async()=>{
        try{ 
            if(window.ethereum){
                const web3 = new Web3(window.ethereum);
                const accounts = await window.ethereum.request({
                    method:"eth_requestAccounts"
                })
                const contractAddress = "0xAeB7e8CC2DE6fcD6cE49896E8FF06eA66b37E344";
                const contract = new web3.eth.Contract(ABI,contractAddress);
                console.log("The Wallet Connection successful"); 
                saveState({web3:web3,contract:contract,account:accounts[0]})
                // console.log(accounts[0]);
                navigate("/navigate")
            }else{
                throw new Error;
            }
        }catch(err){
                console.log(err);
        }
    }
  return ( 
      <>
      <div>
            <button onClick={connectWallet} className='walletButton' >connect wallet</button>
      </div>
      
      
      </>
  )
}

WalletConnection.propTypes = {
    saveState:PropTypes.func.isRequired,
}

export default WalletConnection