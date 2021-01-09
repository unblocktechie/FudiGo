import React, { useState, useEffect } from "react";
import { Button, Modal, Label, List, Segment } from "semantic-ui-react";
import Token from '../abis/Token.json';
import Web3 from 'web3';

function ChkOut(props){
  let url = "/fudigo/#/";
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  let [balance,setBalance] = useState(0);
  const [acc,setAcc] = useState('');
  let orderString = "";

    function loadBlockchainData(){
      const web3 = window.web3;

      web3.eth.getAccounts().then(function(response){
        const account = response[0];
        setAcc(account);
        web3.eth.net.getId().then((response)=>{
          const tokenData = Token.networks[response];
          if(tokenData) {
            const tkn = new web3.eth.Contract(Token.abi, tokenData.address);
            tkn.methods.balanceOf(account).call()
            .then(res=>{setBalance(res.toString()/1000000000000000000)})
            .catch(err=>{console.log(err)});
          } else {
            window.alert('token contract not deployed to detected network.');
          }
        }).catch((err)=>{
          window.alert("something went wrong, try again");
        });
      }).catch(function (error) {
        console.log(error);
      });
      
    }
    
    async function loadWeb3() {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum)
        await window.ethereum.enable()
      }
      else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider)
      }
      else {
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
        window.location.assign("/");
      }
    }
  
    useEffect(() => {
      loadWeb3();  
      loadBlockchainData();
    },[])

    function chkOut(){
      setLoading(true);
      let cost = window.web3.utils.toWei(props.cartValue.toString(), 'Ether');
        props.fudiGo.methods.checkOut(props.payTo,cost,orderString).send({ from: acc })
        .on('confirmation', (confirmation) => {
          window.location.assign(url.concat("orders"));
          setLoading(false);
        })
        .on('error',(error)=>{
          setLoading(false);
          window.alert("transaction failed!!!")});
    }

  return (
    <Modal
      closeIcon
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Label as='a' color="red" size="large">
                CheckOut
                <Label.Detail>{props.cart.length}</Label.Detail>
                </Label>}
    >
      <Modal.Header>Balance : {balance} FDG</Modal.Header>
      <Modal.Content>
      {loading?<Segment basic textAlign="center"><p>Loading...</p></Segment>:
        <Modal.Description>
        <List divided relaxed>
            {props.cart.map((item, index) => {
              orderString = orderString.concat(" ["+item.title+"] ");
            return (
              <List.Item key={index} >
                <div className = "inline">  
                <List.Content>
                  <List.Header as='a'>{item.title}</List.Header>
                  <List.Description as='a'>{item.price} FDG</List.Description>
                </List.Content>
                </div>
                <div className="floatr">
                <Button value={index} 
                  onClick = {props.delete}
                  color="black"
                  size="mini" 
                >delete</Button>
                </div>
              </List.Item>
            );
            })}
        </List>
        </Modal.Description>
      }  
      </Modal.Content>
      <Modal.Actions>
        <div className="inline">
        <Modal.Description>
            Order Cost : {props.cartValue} FDG
        </Modal.Description>
        </div>
        {(balance < props.cartValue)?<p>You have not enough FDG tokens to place order</p>
        :<Button color='red' onClick={chkOut}>
          Pay
        </Button>}
      </Modal.Actions>
    </Modal>
  );
}

export default ChkOut;