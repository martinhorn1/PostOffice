import React, { Component } from 'react';
import { baseUrl } from '../shared/baseUrl';

class Parcels extends Component {
    constructor(props) {
        super(props);

        this.state = {
            parcels: []
        }
    }

    async componentDidMount() {
        await fetch(baseUrl + 'Parcels')
            .then(res => res.json())
            .then(parcels => this.setState({ parcels }));
    }

    render() {
        const getParcelsByBagId = this.state.parcels.filter((elem) => elem.fkPbagId === this.props.pbagId)
        const totalPrice = getParcelsByBagId.map(elem => elem.price).reduce((total, current) => { return total + current }, 0);
        const parcelAmount = getParcelsByBagId.length;
        if (!parcelAmount) {
            return <p>No parcels</p>;
        }
        return <p>Total price: { totalPrice}€, amount of parcels: {parcelAmount}</p>;
    }
}

export default Parcels;