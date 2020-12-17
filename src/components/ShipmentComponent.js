import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { baseUrl } from '../shared/baseUrl';
import CardComponent from './CardComponent';

class Shipment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            isCardOpen: false
        };
        this.toggleCard = this.toggleCard.bind(this);
    }

    async componentDidMount() {
        await fetch(baseUrl + 'Shipments')
            .then(res => res.json())
            .then(data => this.setState({ data }));
    }

    toggleCard() {
        this.setState({
            isCardOpen: !this.state.isCardOpen
        });
    }

    render() {
        return (
            <div className="col mt-4">
                <div>
                    <Button color="primary"><Link to="/create" className="link">Create shipment</Link></Button>
                </div>
                <div className="my-5">
                    {this.state.data.sort((a, b) => a.shipmentId < b.shipmentId ? 1 : -1).map((elem) => (
                        <CardComponent key={elem.shipmentId}
                            shipmentId={elem.shipmentId}
                            shipmentNumber={elem.shipmentNumber}
                            flightNumber={elem.flightNumber}
                            airport={elem.airport}
                            flightDate={elem.flightDate}
                            className="my-5"
                        />
                    ))}
                </div>
            </div>
        )
    }
}

export default Shipment;