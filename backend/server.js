import express from 'express';
import OracleDB from 'oracledb';

const app = express();

const dbConfig = {
    user: 'demo1',
    password: 'demo1',
    connectString: 'localhost:1521/FREEPDB1'
}

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running...');
})

app.get('/employees', (req, res) => {
    OracleDB.getConnection(dbConfig, (err, connection) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Error connecting to the database');
        }

        connection.execute('SELECT * FROM students', (err, result) => {
            if (err) {
                console.error(err.message);
                return res.status(500).send('Error executing query');
            }
            console.log(result);
            res.json(result.rows);
        })
    })
})

app.listen(5000, () => {
    console.log('Server started on http://localhost:5000');
})