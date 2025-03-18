import { getConnection } from "../db/dbConnection.js";
import User from "../models/user.js";


const getAllUsers = async () => {
    try {
        const connection = await getConnection();
        
        const result = await connection.execute('SELECT * FROM users');
        const users = result.rows.map(row => User.fromDbRow(row, result.metaData));
        
        await connection.close();
        
        return users;
    } catch (error) {
        console.error('Error:', error.message);
        return null;
    }
}

export default { getAllUsers };