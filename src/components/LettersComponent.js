import React, { Component } from 'react';
import { baseUrl } from '../shared/baseUrl';
import { ListGroup, ListGroupItem } from 'reactstrap';

class LetterBag extends Component {
    constructor(props) {
        super(props);

        this.state = {
            letters: []
        }
    }

    async componentDidMount() {
        await fetch(baseUrl + 'Letterbags')
            .then(res => res.json())
            .then(letters => this.setState({ letters }));
    }

    
    render() {
        const itemsOnShipment = this.state.letters.filter(elem => elem.fkShipmentId === this.props.shipmentId);
        if (itemsOnShipment.length === 0) return (<p>No letters</p>)
        else return (
            <div>
                <ListGroup>
                    {itemsOnShipment.map((element, index) => {
                        return (
                            <ListGroupItem key={index}>
                                <p>
                                    <strong>Bag {index + 1}</strong>: Bag number: {element.bagNumber}
                                </p>
                                <p>
                                    Price: {element.price}€, Amount of letters: {element.letterCount}
                                </p>
                            </ListGroupItem>
                        );
                    })}
                </ListGroup>
            </div>
        );
    }
}

export default LetterBag;