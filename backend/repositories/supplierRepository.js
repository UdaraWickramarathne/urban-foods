import { getConnection } from "../db/dbConnection.js";
import oracledb from "oracledb";

const getAllSuppliersWithDetails = async () => {
    let connection;
    try {
        // Get a connection from the pool
        connection = await getConnection();
        
        await connection.execute(`BEGIN DBMS_OUTPUT.ENABLE(NULL); END;`);
        
        await connection.execute(`BEGIN get_suppliers_details; END;`);
        
        // Get the output buffer
        const result = await connection.execute(
            `BEGIN DBMS_OUTPUT.GET_LINES(:lines, :numlines); END;`,
            {
                lines: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxArraySize: 5000 },
                numlines: { dir: oracledb.BIND_INOUT, type: oracledb.NUMBER, val: 5000 }
            }
        );
        
        // Process the output and structure it as suppliers array
        const outputLines = result.outBinds.lines || [];
        const suppliers = [];
        let currentSupplier = {};
        
        if (outputLines && outputLines.length > 0) {
            for (let i = 0; i < outputLines.length; i++) {
                const line = outputLines[i];
                
                // Skip null or undefined lines
                if (!line) continue;
                
                if (line.startsWith('Supplier ID: ')) {
                    // If we were processing a supplier before, add it to the array
                    if (Object.keys(currentSupplier).length > 0) {
                        suppliers.push(currentSupplier);
                    }
                    // Start a new supplier
                    currentSupplier = {
                        supplierId: parseInt(line.replace('Supplier ID: ', ''))
                    };
                } else if (line.startsWith('Supplier Name: ')) {
                    currentSupplier.businessName = line.replace('Supplier Name: ', '');
                }else if(line.startsWith('Supplier Email: ')){
                    currentSupplier.email = line.replace('Supplier Email: ', '');
                }else if (line.startsWith('Supplier Address: ')) {
                    currentSupplier.address = line.replace('Supplier Address: ', '');
                } else if (line.startsWith('Product Count: ')) {
                    currentSupplier.productCount = parseInt(line.replace('Product Count: ', ''));
                } else if (line.startsWith('Total Sales: ')) {
                    // Handle null value from database
                    const salesValue = line.replace('Total Sales: ', '');
                    currentSupplier.totalSales = salesValue === '' || salesValue === 'null' ? 0 : parseFloat(salesValue);
                } else if (line.startsWith('Successful Order Count: ')) {
                    currentSupplier.successOrderCount = parseInt(line.replace('Successful Order Count: ', ''));
                }
                
                // If we're at the separator line and have a complete supplier, add it
                if (line.startsWith('------------') && Object.keys(currentSupplier).length > 0) {
                    suppliers.push(currentSupplier);
                    currentSupplier = {};
                }
            }
            
            // Add the last supplier if it wasn't added yet
            if (Object.keys(currentSupplier).length > 0) {
                suppliers.push(currentSupplier);
            }
        }
        
        // Make sure we're not returning an empty array without explanation
        if (suppliers.length === 0) {
            console.log("No supplier data returned from the stored procedure");
            // Optionally log the raw output for debugging
            console.log("Raw output:", outputLines);
        }
        
        return { success: true, data: suppliers };
    } catch (error) {
        console.error('Error in getAllSuppliersWithDetails:', error);
        return { success: false, error: error.message };
    } finally {
        if (connection) {
            try {
                // Release the connection back to the pool
                await connection.close();
            } catch (error) {
                console.error('Error closing connection:', error);
            }
        }
    }
};

const updateSupplier = async (supplierId, supplier) => {
    let connection;
    try {
        connection = await getConnection();
        
        const result = await connection.execute(
            `UPDATE suppliers SET business_name = :businessName, email = :email, address = :address WHERE supplier_id = :supplierId`,
            {
                businessName: supplier.businessName,
                email: supplier.email,
                address: supplier.address,
                supplierId
            },
            { autoCommit: true }
        );
        
        return result;
    } catch (error) {
        console.error('Error updating supplier:', error);
        return null;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (error) {
                console.error('Error closing connection:', error);
            }
        }
    }
}

export default { getAllSuppliersWithDetails };