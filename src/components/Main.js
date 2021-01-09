import React, { Component } from 'react';
import BuyForm from './BuyForm';
import SellForm from './SellForm';
import { Button, Menu } from 'semantic-ui-react';

class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentForm: 'buy'
    }
  }

  render() {
    let content
    if(this.state.currentForm === 'buy') {
      content = <BuyForm
        ethBalance={this.props.ethBalance}
        tokenBalance={this.props.tokenBalance}
        buyTokens={this.props.buyTokens}
      />
    } else {
      content = <SellForm
        ethBalance={this.props.ethBalance}
        tokenBalance={this.props.tokenBalance}
        sellTokens={this.props.sellTokens}
      />
    }

    return (
      <>
        <Menu secondary>
        <Menu.Item>
          <Button
              onClick={(event) => {
                this.setState({ currentForm: 'buy' })
              }}
              color="grey"
              floated="left"
            >
            Buy
          </Button>
        </Menu.Item>  
        <Menu.Item position="right">
          <Button
              onClick={(event) => {
                this.setState({ currentForm: 'sell' })
              }}
              color="grey"
              floated="right"
            >
            Sell
          </Button>
        </Menu.Item>  
        </Menu>  
          {content}
      </> 
    );
  }
}

export default Main;
