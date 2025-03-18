class User {
  constructor(userId, username, role) {
    this.userId = userId;
    this.username = username;
    this.role = role;
  }

  static fromDbRow(row, metadata) {
    if (!row || !metadata || !Array.isArray(metadata)) {
      return null;
    }
    
    // Initialize with default values
    let userId = null;
    let username = null;
    let role = null;
    
    // Check which columns are available in the query results
    metadata.forEach((meta, index) => {
      switch(meta.name) {
        case 'USER_ID':
          userId = row[index];
          break;
        case 'USERNAME':
          username = row[index];
          break;
        case 'ROLE':
          role = row[index];
          break;
      }
    });
    
    // Create user with whatever data we have
    return new User(userId, username, role);
  }
}

export default User;