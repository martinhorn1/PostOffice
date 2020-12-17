import './App.css';
import { Navbar, NavbarBrand } from 'reactstrap';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Shipment from './components/ShipmentComponent';
import Footer from './components/FooterComponent';
import CreateShipment from './components/CreateShipmentComponent';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar color="warning">
          <div className="container">
            <NavbarBrand href="/">Post Office Application</NavbarBrand>
          </div>
        </Navbar>
        <div className="container main-body">
          <Switch>
            <Route exact path="/" component={Shipment} />
            <Route path="/create" component={CreateShipment} />
          </Switch>
          <div className="footer">
            <div className="row-auto">
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
