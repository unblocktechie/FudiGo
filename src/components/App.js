import React from 'react';
import Navbar from './Navbar';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import Menu from './Menu';
import Add from './Add';
import Swap from './Swap';
import Orders from './Orders';
import OrderReceived from './OrderReceived';

function App(){

  return(
    <>
    <Navbar />
    <div className="main">
    <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/menu" component={Menu} />
        <Route path="/add" component={Add} exact/>
        <Route path="/swap" component={Swap} exact/>
        <Route path="/orders" component={Orders} exact/>
        <Route path="/orderlist" component={OrderReceived} exact/>
        <Route component={Home} />
    </Switch>
    </div>
    </>
  );
}

export default App;
