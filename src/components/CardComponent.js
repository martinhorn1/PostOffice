import React, { Component } from 'react';
import { ListGroupItem, Collapse } from 'reactstrap';
import Moment from 'moment';
import LetterBag from './LettersComponent';
import ParcelBag from './ParcelBagComponent';

class CardComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            collapse: false
        }
        this.toggleCard = this.toggleCard.bind(this);
    }

    toggleCard() {
        this.setState({ collapse: !this.state.collapse });
    }

    render() {
        return (
            <ListGroupItem className="my-3">
                <h4 onClick={this.toggleCard}>Shipment {this.props.shipmentNumber}</h4>
                <Collapse isOpen={this.state.collapse}>
                    <div className="row">
                        <div className="col-12">
                            <p>Flight number: {this.props.flightNumber}</p>
                            <p>Flight date: {Moment(this.props.flightDate).format('MMMM Do, YYYY')}</p>
                            <p>Airport: {this.props.airport}</p>
                        </div>
                        <div className="col-sm-6">
                            <p>Letter bags on shipment</p>
                            <LetterBag shipmentId={this.props.shipmentId} />
                        </div>
                        <div className="col-sm-6">
                            <p>Parcel bags on shipment</p>
                            <ParcelBag shipmentId={this.props.shipmentId} />
                        </div>
                    </div>
                </Collapse>
            </ListGroupItem>
        );
    }
}

export default CardComponent;