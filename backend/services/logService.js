const getAffectedTables = (triggerBody) => {
    if (!triggerBody) return [];
    
    // Create a regex to match UPDATE tableName, INSERT INTO tableName, or DELETE FROM tableName
    const regex = /\b(UPDATE|INSERT\s+INTO|DELETE\s+FROM)\s+([a-zA-Z0-9_\.]+)/gi;
    const matches = [...triggerBody.matchAll(regex)];
    
    // Extract table names and remove duplicates
    const affectedTables = [...new Set(matches.map(match => {
      // Get the table name, remove any schema prefixes like 'dbo.'
      let tableName = match[2].toUpperCase();
      if (tableName.includes('.')) {
        tableName = tableName.split('.').pop();
      }
      return tableName;
    }))];
    
    return affectedTables;
};

export default getAffectedTables;