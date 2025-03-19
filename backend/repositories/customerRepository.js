const mongoose = require('mongoose');
const validator = require('validator');

const AddressSchema = new mongoose.Schema({
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
});

const CustomerSchema = new mongoose.Schema({
    customerId: {
        type: String,
        required: true,
        unique: true,
        default: () => 'CUST' + Math.random().toString(36).substr(2, 9).toUpperCase()
    },

    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },

    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: 'Please provide a valid email'
        }
    },

    address: AddressSchema
}, { timestamps: true });

const Customer = mongoose.model('Customer', CustomerSchema);

// Repository methods
class CustomerRepository {
    // Update customer details
    
    async updateCustomer(customerId, updateData) {
        try {
            const customer = await Customer.findOneAndUpdate(
                { customerId: customerId },
                { $set: updateData },
                { new: true, runValidators: true }
            );
            return customer;
        } catch (error) {
            throw error;
        }
    }

    // Update customer address
    async updateCustomerAddress(customerId, addressData) {
        try {
            const customer = await Customer.findOneAndUpdate(
                { customerId: customerId },
                { $set: { address: addressData } },
                { new: true, runValidators: true }
            );
            return customer;
        } catch (error) {
            throw error;
        }
    }

    // Get customer by ID
    async getCustomerById(customerId) {
        try {
            return await Customer.findOne({ customerId: customerId });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new CustomerRepository(); 