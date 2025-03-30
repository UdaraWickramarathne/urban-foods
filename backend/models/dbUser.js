class DbUser {
    constructor(username, created, accoutStatus,) {
        this.username = username;
        this.created = created;
        this.accoutStatus = accoutStatus;
    }
    static fromDbRow(row, metadata) {
        if (!row || !metadata || !Array.isArray(metadata)) {
            return null;
        }
        // Initialize with default values
        let username = null;
        let created = null;
        let accoutStatus = null;

        // Check which columns are available in the query results
        metadata.forEach((meta, index) => {
            switch (meta.name) {
                case 'USERNAME':
                    username = row[index];
                    break;
                case 'CREATED':
                    created = row[index];
                    created = created.toISOString().split('T')[0];
                    created = created.replace(/-/g, '-');
                    created = created.replace(/T/g, ' ');
                    created = created.replace(/Z/g, '');
                    break;
                case 'ACCOUNT_STATUS':
                    accoutStatus = row[index];
                    break;
            }
        });
        // Create user with whatever data we have
        return new DbUser(username, created, accoutStatus);
    }
}

export default DbUser;