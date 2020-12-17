# PostOffice Application
Front end for Post Office application that displays information about shipments and allows creating new shipments.

## Description

The application contains information about created shipments and their contents. It is possible to create new shipments as well. The webpage of the application is responsive.

### Home page

Home page shows all the created shipments with the most recently created shipment on the top. Clicking on a shipment expands the shipment's detailed information. In two columns in the shipment's detailed information is shown which bags of parcels and letters are on the shipment. On top of the shipments is the "Create Shipment" button, which will redirect the user to a new shipment creation page.

### Create shipment page

On creating a new shipment all the required fields must be filled. If a field doesn't match the expected value, then the guiding error messages will be shown. Only current date or a future date can be selected for a flight date. There are two buttons shown in the form to add parcel bags or letter bags. Since a shipment should contain at least one of either bags, then the shipment creation button will appear only if there's at least one bag of letters or parcels. Only one of the forms from adding shipment contents is available at a time.

When all the required conditions are met and the "Create Shipment" button has been clicked, then an alert message appears about a successful creation of the shipment. If all required conditions haven't been fulfilled, an alert will appear and the shipment will not be created. All shipments can be seen again by clicking on the text "Post Office Application" in the navigation bar.

### Adding letters and parcels

Adding letters will create one bag with one submitting of the letterbag form.

Adding parcels will automatically create bags for parcels. One bag can contain a maximum of 5 parcels. If the shipment contains more than 5 parcels, a new bag will be created.

## Installation

Before starting with these steps, start the back end server by following the steps in another repository [here](https://github.com/martinhorn1/PostApi).

- Clone this repository
- Open a terminal window in the project folder
- Install the dependencies by running the following command:
```
npm install
```
or
```
yarn install
```
- Start the project by running the following command:
```
npm start
```
or
```
yarn start
```
The application will run on http://localhost:3000