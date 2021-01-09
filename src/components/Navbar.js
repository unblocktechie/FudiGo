import React from 'react';
import { Icon, Popup } from 'semantic-ui-react';
import {NavLink} from 'react-router-dom';

function Navbar(){
  return(
    <header>
      <h1>
        <NavLink to="/"><Icon name="food"  /></NavLink>
        <NavLink to="/">FudiGo</NavLink>
      </h1>
      <div className="icons">
        <Popup
          trigger={<NavLink to="/add"><Icon name="columns" size="big" /></NavLink>}
          header="Restaurant Owners"
          content="Manage Your Restaurant Here..."
          basic
        />
        <Popup
        trigger={<NavLink to="/swap"><Icon name="exchange" size="big" /></NavLink>}
        header="Swap"
        content="Buy or Sell your FudiGo Tokens..."
        basic
        />
        <Popup
        trigger={<NavLink to="/orders"><Icon name="bars" size="big" /></NavLink>}
        header="Food Lovers"
        content="View Your Orders..."
        basic
        />
      </div>
    </header>
  );
}

export default Navbar;
