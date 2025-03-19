class User {
  constructor(userId, username, password, role) {
    this.userId = userId;
    this.username = username;
    this.password = password;
    this.role = role;
  }

  static fromDbRow(row, metadata) {
    if (!row || !metadata || !Array.isArray(metadata)) {
      return null;
    }
    
    // Initialize with default values
    let userId = null;
    let username = null;
    let password = null;
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
        case 'PASSWORD':
          password = row[index];
          break;
        case 'ROLE':
          role = row[index];
          break;
      }
    });
    
    // Create user with whatever data we have
    return new User(userId, username, password, role);
  }
}

export default User;