import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, Col, Collapse, Row, FormFeedback,  Alert } from 'reactstrap';
import { baseUrl } from '../shared/baseUrl';
import DatePicker, { registerLocale } from 'react-datepicker';
import enGb from 'date-fns/locale/en-GB';
import "react-datepicker/dist/react-datepicker.css";
registerLocale('en-gb', enGb);

class CreateShipment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            flightNumber: '',
            airport: 'TLL',
            flightDate: '',
            parcels: [],
            letters: [],
            recipient: '',
            destination: '',
            weight: '',
            price: '',
            amount: '',
            maxParcelsInBag: 5,
            isLetterFormOpen: false,
            isParcelFormOpen: false,
            submitted: false,
            touched: {
                flightNumber: false,
                airport: false,
                flightDate: false,
                recipient: false,
                destination: false,
                weight: false,
                price: false,
                amount: false
            }
        }
        this.handleBlur = this.handleBlur.bind(this);
        this.handleOpenLetterOrParcel = this.handleOpenLetterOrParcel.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleAddParcel = this.handleAddParcel.bind(this);
        this.handleAddLetter = this.handleAddLetter.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async postShipment() {
        await fetch(baseUrl + 'Shipments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                flightNumber: this.state.flightNumber,
                airport: this.state.airport,
                flightDate: this.state.flightDate
            })
        })
            .catch(err => console.log("Error ", err));
        
        if (this.state.letters.length !== 0) {
            await fetch(baseUrl + 'Shipments')
                .then(res => res.json())
                .then(e => e[e.length - 1].shipmentId)
                .then(shipmentId => this.state.letters.forEach(element => {
                    fetch(baseUrl + 'LetterBags', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            letterCount: element.amount,
                            weight: element.weight,
                            price: element.price,
                            fkShipmentId: shipmentId
                        })
                    })
                }))
                .catch(err => console.log("Error", err));
        }
        
        if (this.state.parcels.length !== 0) {
            const bagAmount = Math.ceil(this.state.parcels.length / this.state.maxParcelsInBag);
            var tempParcels = [].concat(this.state.parcels);
            await fetch(baseUrl + 'Shipments')
                .then(res => res.json())
                .then(e => e[e.length - 1].shipmentId)
                .then(shipmentId => {
                    for (var i = 0; i < bagAmount; i++) {
                        fetch(baseUrl + 'ParcelBags', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                fkShipmentId: shipmentId
                            })
                        })
                            .then(res => res.json())
                            .then(e => tempParcels.splice(0, this.state.maxParcelsInBag).forEach(element => {
                                fetch(baseUrl + 'Parcels', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        recipientName: element.recipient,
                                        destination: element.destination,
                                        weight: element.weight,
                                        price: element.price,
                                        fkPbagId: e.pbagId
                                    })
                                })
                            }))
                    }
                })
                .catch(err => console.log(err));
        }
    }

    handleSubmit = event => {
        event.preventDefault();
        if (this.state.flightNumber !== '' && this.state.airport !== '' && this.state.flightDate !== '' && (this.state.parcels.length !== 0 || this.state.letters.length !== 0)) {
            this.postShipment();
            this.setState({ submitted: true });
        }
        else {
            alert("Required fields not filled");
        }
    }

    handleOpenLetterOrParcel = event => {
        event.preventDefault();
        if (event.target.id === "parcel") {
            if (this.state.isLetterFormOpen) {
                this.setState({
                    isLetterFormOpen: false,
                    touched: {
                        recipient: false,
                        destination: false,
                        weight: false,
                        price: false,
                        amount: false
                    }
                })
            }
            this.setState({ isParcelFormOpen: !this.state.isParcelFormOpen });
        }
        else if (event.target.id === "letter") {
            if (this.state.isParcelFormOpen) {
                this.setState({
                    isParcelFormOpen: false,
                    touched: {
                        recipient: false,
                        destination: false,
                        weight: false,
                        price: false,
                        amount: false
                    }})
            }
            this.setState({ isLetterFormOpen: !this.state.isLetterFormOpen });
        }
    }

    handleValueChange = event => {
        event.preventDefault();
        this.setState({ [event.target.name]: event.target.value });
    }

    handleAddParcel = event => {
        if (this.state.recipient && this.state.destination && this.state.weight && this.state.price) {
            this.setState({ parcels: [...this.state.parcels, event] });
            this.setState({ recipient: '', destination: '', weight: '', price: '', touched: { price: false, weight: false } });
        }
        else {
            alert("Required fields not filled to add parcel");
        }
    }

    handleAddLetter = event => {
        if (this.state.amount && this.state.weight && this.state.price) {
            this.setState({ letters: [...this.state.letters, event] });
            this.setState({ amount: '', weight: '', price: '', touched: { price: false, weight: false } });
        }
        else {
            alert("Required fields not filled to add letters");
        }
    }

    handleBlur = field => (e) => {
        this.setState({ touched: { ...this.state.touched, [field]: true } });
    }

    validate(flightNumber, weight, price, amount, recipient, destination) {
        const errors = {
            flightNumber: '',
            recipient: '',
            destination: '',
            weight: '',
            price: '',
            amount: '',
        };

        const flightNumberReg = new RegExp(/^[A-Za-z]{2}[0-9]{4}$/);
        if (this.state.touched.flightNumber) {
            if (flightNumber.length === 0) {
                errors.flightNumber = "Flight number required"
            }
            else if (!flightNumberReg.test(flightNumber)) {
                errors.flightNumber = "Flight number must have two letters and four numbers in this order (example: AA0000)"
            }
        }

        if (this.state.touched.recipient && recipient.length === 0) {
            errors.recipient = "Recipient required"
        }

        const destinationReg = new RegExp(/[A-Z]{2}/);
        if (this.state.touched.destination && !destinationReg.test(destination)) {
            errors.destination = "Destination should consist of two capital letters (example: EE)"
        }

        const weightReg = new RegExp(/^\d+(\.\d{1,3})?$/);
        if (this.state.touched.weight && !weightReg.test(weight)) {
            errors.weight = "Weight should have maximum 3 decimal spaces and have a positive value"
        }

        const priceReg = new RegExp(/^\d+(\.\d{1,2})?$/);
        if (this.state.touched.price && !priceReg.test(price)) {
            errors.price = "Price should have maximum 2 decimal spaces and have a positive value"
        }

        const amountReg = new RegExp(/^\d+$/);
        if (this.state.touched.amount && !amountReg.test(amount)) {
            errors.amount = "Letter count should be a positive integer value"
        }

        return errors;
    }
    
    render() {
        const curDate = new Date();
        let { recipient, destination, weight, price, amount } = this.state;
        const errors = this.validate(this.state.flightNumber, weight, price, amount, recipient, destination)
        return (
            <Form className="col-sm-10 offset-sm-1" onSubmit={this.handleSubmit}>
                <div className="col-12 my-4">
                    <h2>Create new shipment</h2>
                </div>

                <FormGroup row>
                    <Label for="flightNo" sm={3}>Flight Number<strong className="text-danger"> *</strong></Label>
                    <Col sm={9}>
                        <Input type="text" name="flightNumber" id="flightNo"
                            value={this.state.flightNumber}
                            onChange={this.handleValueChange}
                            valid={errors.flightNumber === ''}
                            invalid={errors.flightNumber !== ''}
                            onBlur={this.handleBlur('flightNumber')} />
                        <FormFeedback>{errors.flightNumber}</FormFeedback>
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Label for="airport" sm={3}>Airport<strong className="text-danger"> *</strong></Label>
                    <Col sm={9}>
                        <FormGroup>
                            <FormGroup check inline>
                                <Label check>
                                    <Input type="radio" name="airport" value="TLL" onChange={airport => this.setState({airport: airport.target.value})} defaultChecked />TLL
                                </Label>
                            </FormGroup>
                            <FormGroup check inline>
                                <Label check>
                                    <Input type="radio" name="airport" value="RIX" onChange={airport => this.setState({airport: airport.target.value})} />RIX
                                </Label>
                            </FormGroup>
                            <FormGroup check inline>
                                <Label check>
                                    <Input type="radio" name="airport" value="HEL" onChange={airport => this.setState({airport: airport.target.value})} />HEL
                                </Label>
                            </FormGroup>
                        </FormGroup>
                    </Col>
                </FormGroup>

                <FormGroup row>
                    <Label for="flightDate" sm={3}>Date<strong className="text-danger"> *</strong></Label>
                    <Col sm={9}>
                        <DatePicker
                            id="flightDate"
                            selected={this.state.flightDate}
                            locale="en-gb"
                            minDate={curDate}
                            value={curDate}
                            onChange={flightDate => this.setState({ flightDate: flightDate })} />
                    </Col>
                </FormGroup>

                <Row>
                    <Col className="mb-5 mt-2">
                        Shipment contains: {Math.ceil(this.state.parcels.length / this.state.maxParcelsInBag)} {Math.ceil(this.state.parcels.length / this.state.maxParcelsInBag) === 1 ? " bag" : " bags"} of { this.state.parcels.length } parcels, {this.state.letters.length === 1 ? "1 bag" : [this.state.letters.length] + " bags"} of letters.
                    </Col>
                </Row>

                <FormGroup>
                    <Col className="d-flex justify-content-around col-md-6 offset-md-3">
                        <div className="bg-primary p-2 text-white rounded" id="parcel" onClick={this.handleOpenLetterOrParcel}>Add Bag of Parcels</div>
                        <div className="bg-primary p-2 text-white rounded" id="letter" onClick={this.handleOpenLetterOrParcel}>Add Bag of Letters</div>
                    </Col>
                </FormGroup>

                <Row>
                    <Collapse isOpen={this.state.isParcelFormOpen} className="col-md-6 offset-md-3 my-4">
                        <h4>Add parcel</h4>
                        <FormGroup>
                            <Label>Recipient name<strong className="text-danger"> *</strong></Label>
                            <Col>
                                <Input type="text" value={recipient} maxLength={100}
                                    onChange={(e) => this.setState({ recipient: e.target.value })}
                                    valid={errors.recipient === ''} invalid={errors.recipient !== ''} onBlur={this.handleBlur('recipient')}/>
                                <FormFeedback>{errors.recipient}</FormFeedback>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Label>Destination country code<strong className="text-danger"> *</strong></Label>
                            <Col>
                                <Input type="text" value={destination}
                                    onChange={(e) => this.setState({ destination: e.target.value })}
                                    valid={errors.destination === ''} invalid={errors.destination !== ''} onBlur={this.handleBlur('destination')}/>
                                <FormFeedback>{errors.destination}</FormFeedback>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Label>Weight (kg)<strong className="text-danger"> *</strong></Label>
                            <Col>
                                <Input type="number" value={weight}
                                    onChange={(e) => this.setState({ weight: e.target.value })}
                                    valid={errors.weight === ''} invalid={errors.weight !== ''} onBlur={this.handleBlur('weight')} />
                                <FormFeedback>{errors.weight}</FormFeedback>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Label>Price (€)<strong className="text-danger"> *</strong></Label>
                            <Col>
                                <Input type="number" value={price}
                                    onChange={(e) => this.setState({ price: e.target.value })}
                                    valid={errors.price === ''} invalid={errors.price !== ''} onBlur={this.handleBlur('price')} />
                                <FormFeedback>{errors.price}</FormFeedback>
                            </Col>
                        </FormGroup>
                        <Button onClick={() => this.handleAddParcel({recipient, destination, weight, price})}>Add Parcel</Button>
                    </Collapse>
                
                    <Collapse isOpen={this.state.isLetterFormOpen} className="col-md-6 offset-md-3 my-4">
                        <h4>Add letter</h4>
                        <FormGroup>
                            <Label>Letter count<strong className="text-danger"> *</strong></Label>
                            <Col>
                                <Input type="number" min={1} value={amount} onChange={(e) => this.setState({ amount: e.target.value })}
                                    valid={errors.amount === ''} invalid={errors.amount !== ''} onBlur={this.handleBlur('amount')} />
                                <FormFeedback>{errors.amount}</FormFeedback>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Label>Weight (kg)<strong className="text-danger"> *</strong></Label>
                            <Col>
                                <Input type="number" value={weight} onChange={(e) => this.setState({ weight: e.target.value })}
                                    valid={errors.weight === ''} invalid={errors.weight !== ''} onBlur={this.handleBlur('weight')} />
                                <FormFeedback>{errors.weight}</FormFeedback>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Label>Price (€)<strong className="text-danger"> *</strong></Label>
                            <Col>
                                <Input type="number" value={price} onChange={(e) => this.setState({ price: e.target.value })}
                                    valid={errors.price === ''} invalid={errors.price !== ''} onBlur={this.handleBlur('price')} />
                                <FormFeedback>{errors.price}</FormFeedback>
                            </Col>
                        </FormGroup>
                        <Button onClick={() => this.handleAddLetter({ amount, weight, price })}>Add Letters</Button>
                    </Collapse>
                </Row>

                <FormGroup check row className="my-5" hidden={this.state.parcels.length === 0 && this.state.letters.length === 0}>
                    <Col>
                        <Button type="button" onClick={this.handleSubmit}>Create Shipment </Button>
                    </Col>
                </FormGroup>
                <Col>
                    <Alert className="mt-3" hidden={!this.state.submitted} color="success">Shipment created</Alert>
                </Col>
            </Form>
        );
    }
}

export default CreateShipment;