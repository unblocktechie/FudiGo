import React, { useState } from "react";
import { Button, Modal, Form } from "semantic-ui-react";

function UpdateItem(props){
  const [open, setOpen] = useState(false);
  const [ipData, setIpData] = useState({
    name : "" ,
    price : ""  
 });

 function handleChange(event) {
  const { name, value } = event.target;

  setIpData(prevIpData => {
    return {
      ...prevIpData,
      [name]: value
    };
  });
  }   

  function update(){
    props.updateMenu(ipData.name,ipData.price,props.id);
  }

  return (
    <Modal
      closeIcon
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button color="black" size="mini" floated="right">Update</Button>}
    >
      <Modal.Header>Update Item</Modal.Header>
      <Modal.Content>
        <Modal.Description>
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
        </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={update} color='red'>
          Update
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default UpdateItem;