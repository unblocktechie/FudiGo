import React, { Component } from 'react';
import tokenLogo from '../fdg.png';
import ethLogo from '../eth-logo.png';
import { Form, Button, Segment, Message } from 'semantic-ui-react';

class BuyForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      output: '0'
    }
  }

  costumStyle = {borderRadius : "50%"};

  render() {
    return (
      <Segment basic>
      <Form onSubmit={(event) => {
          event.preventDefault()
          let etherAmount
          etherAmount = this.input.value.toString()
          etherAmount = window.web3.utils.toWei(etherAmount, 'Ether')
          this.props.buyTokens(etherAmount)
      }}>
      
      <Form.Field>
        <label>
        <img src={ethLogo} height='20' alt=""/>
        </label>  
          <span>
            <b>Ether Balance:</b> {window.web3.utils.fromWei(this.props.ethBalance, 'Ether')} ETH
          </span>
          <input
            type="text"
            onChange={(event) => {
              const etherAmount = this.input.value.toString()
              this.setState({
                output: etherAmount * 10000
              })
            }}
            ref={(input) => { this.input = input }}
            placeholder="0"
            required />
      </Form.Field>

      <Form.Field>
        <label>
        <img src={tokenLogo} height='20' width='20' style={this.costumStyle} alt=""/>  
        </label>  
          <span>
            <b>FudiGo Balance:</b> {window.web3.utils.fromWei(this.props.tokenBalance, 'Ether')} FDG
          </span>
       
          <input
            type="text"
            placeholder="0"
            value={this.state.output}
            disabled
          />
      </Form.Field>  
      <Form.Field>
        <span>
        <Message>
        <Message.Header>Exchange Rate</Message.Header>
        <p>1 ETH = 10000 FDG</p>
        </Message>
        </span>
      </Form.Field>
      <Form.Field>
        <Button type="submit" color="black" size="huge" fluid >SWAP!</Button>
      </Form.Field>
      </Form>
      </Segment>
    );
  }
}

export default BuyForm;
