import React from 'react'
import Web3 from 'web3';
import ABI from './ABI.json';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types'

const WalletConnection = ({saveState}) => {
    const navigate = useNavigate();
    const connectWallet = async()=>{
        try{ 
            if(window.ethereum){
                const web3 = new Web3(window.ethereum);
                const accounts = await window.ethereum.request({
                    method:"eth_requestAccounts"
                })
                const contractAddress = "0xB5445afdd204e8EC78B745D7c5Ac08507703B9cD";
                const contract = new web3.eth.Contract(ABI,contractAddress);
                console.log("The Wallet Connection successful"); 
                saveState({web3:web3,contract:contract,account:accounts[0]})
                navigate("/view-all-doctors")
            }else{
                throw new Error;
            }
        }catch(err){
                console.log(err);
        }
    }
    const navigateAppointment =() =>{
        navigate('/AddDoctor')
    }
  return ( 
      <>
      <button onClick={navigateAppointment}>Get Appointment page</button>
      <button onClick={connectWallet}>connect wallet</button>
      
      </>
  )
}

WalletConnection.propTypes = {
    saveState:PropTypes.func.isRequired,
}

export default WalletConnection