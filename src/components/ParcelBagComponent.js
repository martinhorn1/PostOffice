import React, { Component } from 'react';
import { baseUrl } from '../shared/baseUrl';
import { ListGroup, ListGroupItem } from 'reactstrap';
import Parcels from './ParcelsComponent';

class ParcelBag extends Component {
    constructor(props) {
        super(props);

        this.state = {
            parcelBags: []
        }
    }

    async componentDidMount() {
        await fetch(baseUrl + 'Parcelbags')
            .then(res => res.json())
            .then(parcelBags => this.setState({ parcelBags }));
    }


    render() {
        const parcelBagsOnShipment = this.state.parcelBags.filter(elem => elem.fkShipmentId === this.props.shipmentId);
        if (parcelBagsOnShipment.length === 0) return <p>No parcels</p>
        else return (
            <div>
                <ListGroup>
                    {parcelBagsOnShipment.map((element, index) => {
                        return (
                            <ListGroupItem key={index}>
                                <p>
                                    <strong>Bag {index + 1}</strong>: Bag number: {element.bagNumber}
                                </p>
                                <p>
                                    <Parcels pbagId={element.pbagId} />
                                </p>
                            </ListGroupItem>
                        );
                    })}
                </ListGroup>
            </div>
        );
    }
}

export default ParcelBag;