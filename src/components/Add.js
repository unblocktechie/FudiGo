import React, { useState, useEffect} from "react";
import { Button, Form, Segment, List, Message, Loader } from 'semantic-ui-react';
import FudiGo from '../abis/FudiGo.json';
import Web3 from 'web3';
import UpdateItem from "./UpdateItem";

function Add(props){
    let url = "/fudigo/#/";
    const [loading, setLoading] = useState(false);
    let [account,setAccount] = useState('');
    let [accountName,setAccountName] = useState('');
    const [fudiGo, setFudiGo] = useState({});
    const [ipData, setIpData] = useState({
        name : "" ,
        price : "",
        resName : ""  
     });
    const [menu,setMenu] = useState([]); 

    function loadBlockchainData(){
        const web3 = window.web3;
        
        web3.eth.getAccounts().then(function(response){
          const acc = response[0];  
          setAccount(response[0]);
            
            web3.eth.net.getId().then((response)=>{
              const fudiGoData = FudiGo.networks[response];
              if(fudiGoData) {
                const fudi = new web3.eth.Contract(FudiGo.abi, fudiGoData.address);
                setFudiGo(fudi);

                fudi.methods.names(acc).call()
                .then(res=>setAccountName(res))
                .catch(err=>{console.log(err)});
    
                fudi.methods.counts(acc).call()
                .then(res=>{
                      for (var i = res.toString(); i >= 1 ; i--) {
                        let id = i;
                        fudi.methods.items(acc,i).call()
                        .then(res=>{
                          setMenu(prevMenu => {
                            return [...prevMenu, {title : res.name,
                                    id : id,
                                    price : res.price.toString() } ];
                          });
                        })
                        .catch(err=>{window.alert("something went wrong, try again")});
                      }
                });  
              } else {
                window.alert('fudigo contract not deployed to detected network.');
              }
          
            }).catch((err)=>{
              console.log(err);
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
          window.location.assign("/fudigo/");
        }
    }
    
      useEffect(() => {
        loadWeb3();  
        loadBlockchainData();
      },[])
    
      function handleChange(event) {
        const { name, value } = event.target;
    
        setIpData(prevIpData => {
          return {
            ...prevIpData,
            [name]: value
          };
        });
      }  

    function addItem(){
      setLoading(true);
        fudiGo.methods.createItem(ipData.name,ipData.price).send({ from: account })
        .on('confirmation', (confirmation) => {
            window.alert("Item added successfully");
            window.location.reload();
        })
        .on('error',(error)=>{
          setLoading(false);
          window.alert("item update failed!!!")});
    }  

    function update(name,price,id){
      setLoading(true);
      fudiGo.methods.updateItem(name,price,id).send({ from: account })
      .on('confirmation', (confirmation) => {
          window.alert("Item updated successfully");
          window.location.reload();
      })
      .on('error',(error)=>{
        setLoading(false);
        window.alert("update failed!!!")});
    }

    function reset(){
      setLoading(true);
      fudiGo.methods.resetMenu().send({ from: account })
      .on('confirmation', (confirmation) => {
          window.alert("Menu reset successfully");
          window.location.reload();
      })
      .on('error',(error)=>{
        setLoading(false);
        window.alert("reset failed!!!")});
    }

    function resetToken(){
      setLoading(true);
      fudiGo.methods.resetNumber().send({ from: account })
      .on('confirmation', (confirmation) => {
          window.alert("Token count reset successfully");
          window.location.reload();
      })
      .on('error',(error)=>{
        setLoading(false);
        window.alert("reset failed!!!")});
    }

    function addName(){
      setLoading(true);
      fudiGo.methods.updateName(ipData.resName).send({ from: account })
      .on('confirmation', (confirmation) => {
          window.alert("Restaurant name updated successfully");
          window.location.reload();
      })
      .on('error',(error)=>{
        setLoading(false);
        window.alert("update failed!!!")});
    }

    return(
      <>
      {loading?<Loader active inline='centered' />:
      <>
      <Segment>
        {(accountName)&&<h1>{accountName}</h1>}
        <div className="wrap"><p>{account}</p></div>
        <Button onClick={()=>{window.location.assign(url.concat("orderlist"))}} 
          color="black" size="mini">Order Details</Button>
        <Button onClick={resetToken} 
          color="black" size="mini">Reset Token Counter</Button>    
      </Segment>
      <Segment>
          <Form>
          <Form.Input 
              placeholder="Update Restaurant's Name"
              name='resName'
              value={ipData.resName}
              onChange={handleChange} />   
          <Button onClick={addName} color="grey" fluid>Update</Button>
          </Form>
      </Segment>  
      <Segment>
        <Form>
        <Form.Input 
            placeholder='Item name'
            name='name'
            value={ipData.name}
            onChange={handleChange} />
        <Form.Input 
            placeholder='Item price(FDG)'
            name='price'
            value={ipData.price}
            onChange={handleChange} />    
        <Button onClick={addItem} color="black">Add Item</Button>
        </Form>
      </Segment> 
      <Segment> 
      <List divided relaxed>
      {(menu.length===0)&&<p>No Items Added yet!</p>}
            {menu.map((item, index) => {
            return (
              <List.Item key={index} >
                <div className = "inline">  
                <List.Content>
                  <List.Header as='a'>{item.title}</List.Header>
                  <List.Description as='a'>{item.price} FDG</List.Description>
                </List.Content>
                </div>
                <UpdateItem id={item.id} updateMenu={update} />
              </List.Item>
            );
            })}
        </List>
      </Segment>  
      <Segment textAlign="center">   
        <Message warning>
        <Message.Header>Clicking Reset Menu button will delete your entire menu items</Message.Header>
        </Message>    
        <Button onClick={reset} 
          color="grey" fluid>Reset Menu</Button>    
      </Segment> 
      </>
      }
    </>  
    );
}

export default Add;