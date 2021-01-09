import React, { useState, useEffect } from "react";
import FudiGo from '../abis/FudiGo.json';
import Web3 from 'web3';
import { List, Segment, Loader } from 'semantic-ui-react';

function OrderReceived(){

    const [orders,setOrder] = useState([]); 
    const [loading, setLoading] = useState(false);
    function loadBlockchainData(){
        const web3 = window.web3;
        setLoading(true);
        web3.eth.getAccounts().then(function(response){
          const account = response[0];
          web3.eth.net.getId().then((response)=>{
            const fudiGoData = FudiGo.networks[response];
            if(fudiGoData) {
              const fdg = new web3.eth.Contract(FudiGo.abi, fudiGoData.address);
              
              fdg.getPastEvents('OrderPlaced', { fromBlock: 0, toBlock: 'latest', 
              filter: {owner: account  } })
              .then(res=>{
                setOrder(res);
                setLoading(false);
              })
              .catch(
                err=>{
                  setLoading(false);
              });

            } else {
              window.alert('fudigo contract not deployed to detected network.');
              setLoading(false);
            }
          }).catch((err)=>{
            window.alert("something went wrong, try again");
            setLoading(false);
          });
        }).catch(function (error) {
          console.log(error);
          setLoading(false);
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
          window.location.assign("/fudigo/");
        }
      }
    
      useEffect(() => {
        loadWeb3();  
        loadBlockchainData();
      },[])

    return(
        <>
        <Segment>
        <h1>My Orders</h1>
        </Segment>
        {loading?<Loader active inline='centered' />:
        <Segment>
        {(orders.length===0)&&<p>No orders yet!</p>}
        <List divided relaxed>
            {orders.reverse().map((item, index) => {
            return (
              <List.Item key={index} >
                <div className = "wrap">  
                <List.Content>
                  <List.Header> Token Number : {item.returnValues.number.toString()} </List.Header>
                  <List.Description> Order Id : {item.returnValues.id.toString()} </List.Description>
                  <List.Description> Price : {item.returnValues.price.toString()/1000000000000000000} FDG </List.Description>
                  <List.Description> Items : {item.returnValues.items} </List.Description>
                  <List.Description> Customer Id : {item.returnValues.spender} </List.Description>
                </List.Content>
                </div>
              </List.Item>
            );
            })}
        </List>   
        </Segment> 
        }
        </>
    );
}

export default OrderReceived;