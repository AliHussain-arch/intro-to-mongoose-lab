const prompt = require('prompt-sync')();
const mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');
const Customer = require('./models/customerModel.js');
const connectToDB = require('./config/DBconnection.js');
const app = express();
app.use(morgan('dev'));


console.log('Database connection established');
let action = undefined;
const username = prompt('What is your name? ');
console.log(`Welcome ${username}`);
console.log('***********************************');

// Function to create a customer
function createCustomer() {
    const customerName = prompt("Enter the customer's name: ");
    const customerAge = prompt("Enter the customer's age: ");
    console.log();
    return Customer.create({
        name: customerName.trim(),
        age: customerAge
    })
        .catch(error => {
            console.error('Invalid Input');
        });
}

// Function to view all customers
function viewCustomers() {
    return Customer.find()
        .then(customers => {
            if(customers.length > 0){
                customers.forEach(element => {
                    console.log(`id: ${String(element._id)} -- Name: ${String(element.name)}, Age: ${String(element.age)}`);
                });
            }
            else{
                console.log('No available customers')
            }
        });
}

// Function to find by ID and update
function findByIdAndUpdate () {
    const customerID = prompt('Enter the customer ID: ');
    const UpdatedcustomerName = prompt('Enter the new customer name: ');
    const UpdatedcustomerAge = prompt('Enter the new customer age: ');
    console.log();
    return Customer.findByIdAndUpdate(customerID,{name: UpdatedcustomerName.trim(), age: UpdatedcustomerAge})
        .catch(error => {
            console.error('Invalid Input');
        });
}

// Function to find by ID and delete
function findByIdAndDelete () {
    const customerID = prompt('Enter the customer ID: ');
    console.log();
    return Customer.findByIdAndDelete(customerID)
        .catch(error => {
            console.error('Invalid ID');
        });
}

// Function to choose action
function chooseAction() {
    console.log()
    console.log('CHOOSE THE ACTION');
    console.log('Enter C to Create a customer');
    console.log('Enter V to View all customers');
    console.log('Enter U to Update a customer');
    console.log('Enter D to Delete a customer');
    console.log('Enter Q to Quit');
    console.log()
    action = prompt('What is your action? ');

    if (action === 'C') {
        console.log();
        console.log('*************** CREATING CUSTOMERS ***************');
        console.log();
        return createCustomer();
    } else if (action === 'V') {
        console.log();
        console.log('*************** VIEWING CUSTOMERS ***************');
        console.log();
        return viewCustomers();
    } else if (action === 'U') {
        console.log();
        console.log('*************** UPDATING CUSTOMERS ***************');
        console.log();
        return findByIdAndUpdate();
    } else if (action === 'D') {
        console.log();
        console.log('*************** DELETING CUSTOMERS ***************');
        console.log();
        return findByIdAndDelete();
    } else if (action === 'Q') {
        console.log('************ YOU CHOOSE Q *************');
        console.log('RESTART THE APPLICATION TO USE IT AGAIN');
        console.log();
        console.log('exiting...');
        mongoose.connection.close()
        return Promise.resolve(); 
    } else {
        console.log();
        console.log('INVALID ACTION');
        return Promise.resolve(); 
    }
  }

// Connect to MongoDB first
connectToDB()
  .then(() => {
    // Application loop
    function runApplication() {
      return chooseAction()
        .then(() => {
          if (action !== 'Q') {
            return runApplication();
          }
        });
    }
    return runApplication();
  });

