class Customer {
    constructor(customerId, firstName, lastName, email, phone, address, imageUrl) {
        this.customerId = customerId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        //this.phone = phone;
        this.address = address;
        this.imageUrl = imageUrl;
    }

    static fromDbRow(row, metadata) {
        if (!row || !metadata || !Array.isArray(metadata)) {
            return null;
        }

        // Initialize with default values
        let customerId = null;
        let firstName = null;
        let lastName = null;
        let email = null;
        //let phone = null;
        let address = null;
        let imageUrl = null;

        // Check which columns are available in the query results
        metadata.forEach((meta, index) => {
            switch (meta.name) {
                case 'CUSTOMER_ID':
                    customerId = row[index];
                    break;
                case 'FIRST_NAME':
                    firstName = row[index];
                    break;
                case 'LAST_NAME':
                    lastName = row[index];
                    break;
                case 'EMAIL':
                    email = row[index];
                    break;
                // case 'PHONE':
                //     phone = row[index];
                //     break;
                case 'ADDRESS':
                    address = row[index];
                    break;
                case 'IMAGE_URL':
                    imageUrl = row[index];
                    break;
            }
        });

        // Create user with whatever data we have
        return new Customer(customerId, firstName, lastName, email, address, imageUrl);
    }
}

export default Customer;