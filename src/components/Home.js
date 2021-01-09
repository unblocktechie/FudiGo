import React,{ useState } from 'react';
import { Input, Button, Segment, Message } from 'semantic-ui-react';
import {useHistory} from "react-router-dom";

function Home(){
   let history = useHistory();
   const [inp, setInp] = useState("");

   function handleChange(event){
      setInp(event.target.value);
   }

   function changePage(){
      history.push("/menu?q=".concat(inp))
   }

     return(
        <div className="search"> 
         <Segment basic textAlign="center">
            <img src="./images/fdg.png" width="75px" alt="FDG logo" />   
         </Segment>
         <Segment basic textAlign="center">
         <Input placeholder="restaurent's ID" onChange={handleChange} size="massive" fluid />
         </Segment>
         <Segment basic textAlign="center">
         <Button onClick={changePage} color="black" size="big" >Feed Me</Button>
         </Segment>
         <Segment basic textAlign="center">
         <Message compact>
         This project runs on Ropsten Test Network.
         </Message>
         </Segment>
        </div>
      
     );
}

export default Home;
