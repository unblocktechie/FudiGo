import React, { useState, useEffect} from "react";
import FudiGo from '../abis/FudiGo.json';
import Web3 from 'web3';
import { List, Button, Segment } from 'semantic-ui-react';
import ChkOut from "./ChkOut";

function Menu(props){
    let resAddress = (props.location.search).slice(3);
    let [accountName,setAccountName] = useState('');
    const [menu,setMenu] = useState([]);
    const [cart,setCart] = useState([]);
    const [cartValue,setCartValue] = useState(0);
    const [fudiGo,setFudiGo] = useState({});

    function loadBlockchainData(){
        const web3 = window.web3
  
        web3.eth.net.getId().then((response)=>{
          const fudiGoData = FudiGo.networks[response];
          if(fudiGoData) {
            const fudi = new web3.eth.Contract(FudiGo.abi, fudiGoData.address);
              setFudiGo(fudi);

              fudi.methods.names(resAddress).call()
                .then(res=>setAccountName(res))
                .catch(err=>{console.log(err)});

              fudi.methods.counts(resAddress).call()
              .then(res=>{
                    for (var i = res.toString(); i >= 1 ; i--) {
                      fudi.methods.items(resAddress,i).call()
                      .then(res=>{
                        setMenu(prevMenu => {
                          return [...prevMenu, {title : res.name,
                                  price : res.price.toString() } ];
                        });
                      })
                      .catch(err=>{window.alert("something went wrong, try again")});
                    }
              })
              .catch(err=>{window.alert("something went wrong, try again")});
              
          } else {
            window.alert('fudigo contract not deployed to detected network.');
          }
      
        }).catch((err)=>{
          window.alert("something went wrong, try again");
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
    
    function handleClick(event){
      let index = event.target.value;
      setCartValue(cartValue+parseInt(menu[index].price));
      setCart(prevCart => {
        return [...prevCart, {title : menu[index].title,
                price : menu[index].price} ];
      });
    }

    function deleteItem(event){
      let id = parseInt(event.target.value);
      setCartValue(cartValue-parseInt(cart[id].price));
      setCart(prevCart => {
        return prevCart.filter((item,index) => {
          return index !== id;
        });
      });
    }

    return(
        <>
        <Segment>
        {(accountName)&&<h1>{accountName}</h1>}
        <div className="wrap"><p>{resAddress}</p></div>
          <ChkOut cart={cart} cartValue={cartValue} delete={deleteItem} payTo={resAddress} fudiGo={fudiGo}
          />
        </Segment>
        <Segment>
        {(menu.length===0)&&<p>No Items yet!</p>}
        <List divided relaxed>
            {menu.map((item, index) => {
            return (
              <List.Item key={index} >
                <div className = "inline">  
                <List.Content>
                  <List.Header as='a'>{item.title}</List.Header>
                  <List.Description as='a'>{item.price} FDG</List.Description>
                </List.Content>
                </div>
                <Button onClick={handleClick} value={index}
                  color="black" size="mini" floated="right"
                >Add</Button>
              </List.Item>
            );
            })}
        </List> 
        </Segment>   
        </>
    );
}

export default Menu;