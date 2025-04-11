import { getConnection } from "../db/dbConnection.js";

// Function to generate unique tracking numbers
const generateTrackingNumber = () => {
  // Prefix for tracking number
  const prefix = "TRK";
  
  // Current timestamp in milliseconds
  const timestamp = Date.now().toString().slice(-8);
  
  // Random alphanumeric component (6 characters)
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let random = '';
  for (let i = 0; i < 6; i++) {
    random += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  // Combine into tracking number format
  return `${prefix}-${timestamp}-${random}`; 
};

const addDelevery = async (orderId) => {
    try {
        const connection = await getConnection();

        const query = `INSERT INTO deliveries (order_id, status, tracking_number)
                     VALUES (:orderId, :deliveryStatus, :trackingNumber)`;
    
        const binds = {
            orderId,
            deliveryStatus: "PENDING",
            trackingNumber: generateTrackingNumber(),
        };
    
        await connection.execute(query, binds);
        await connection.commit();
        await connection.close();
    
        return { success: true };
    } catch (error) {
        console.error("Error adding delivery:", error.message);
        return { success: false, message: error.message };
    }
}

const getAllDeliveries = async () => {
    try {
        const connection = await getConnection();
        const query = `SELECT 
        d.delivery_id, 
        d.order_id, 
        c.first_name || ' ' || c.last_name AS customer_name,
        d.status,
        d.tracking_number,
        d.estimated_date,
        d.delivered_date,
        d.assign_agent_id
        FROM deliveries d
        JOIN Orders o ON d.order_id = o.order_id
        JOIN Customers c ON o.customer_id = c.customer_id
        ORDER BY d.delivery_id DESC`;

        const result = await connection.execute(query);
        const deliveries = result.rows.map((row) => {
            return {
                deliveryId: row[0],
                orderId: row[1],
                customerName: row[2],
                status: row[3],
                trackingNumber: row[4],
                estimatedDate: row[5],
                deliveredDate: row[6],
                assignedAgentId: row[7]
            };
        });
        await connection.close();
        return deliveries;
    } catch (error) {
        console.error("Error fetching deliveries:", error.message);
        return null;
    }
}

const getDeliveryAgents = async () => {
    try {
        const connection = await getConnection();
        const query = `SELECT * FROM delivery_agents`;
        const result = await connection.execute(query);
        const agents = result.rows.map((row) => {
            return {
                agentId: row[0],
                name: row[1],
                email: row[2],
            };
        });
        await connection.close();
        return agents;
    } catch (error) {
        console.error("Error fetching delivery agents:", error.message);
        return null;
    }
}

const updateDeliveryStatus = async (deliveryId, status) => {
    try {
        const connection = await getConnection();
        const query = `UPDATE deliveries SET status = :status WHERE delivery_id = :deliveryId`;
        const binds = {
            status,
            deliveryId,
        };
        await connection.execute(query, binds);

        if (status === "DELIVERED") {
            const updateQuery = `UPDATE orders SET status = 'COMPLETED' WHERE order_id = (SELECT order_id FROM deliveries WHERE delivery_id = :deliveryId)`;
            await connection.execute(updateQuery, { deliveryId });

            const deliveredDateQuery = `UPDATE deliveries SET delivered_date = SYSDATE WHERE delivery_id = :deliveryId`;
            await connection.execute(deliveredDateQuery, { deliveryId });
        }

        await connection.commit();
        await connection.close();
        return { success: true };
    } catch (error) {
        console.error("Error updating delivery status:", error.message);
        return { success: false, message: error.message };
    }
}

const assignDeliveryAgent = async (deliveryId, agentId) => {
    try {
        console.log("Assigning delivery agent:", agentId);
        
        const connection = await getConnection();
        const status = agentId === '' ? "PENDING" : "IN TRANSIT";
        
        // Update agent and status in one query
        const agentQuery = `
            UPDATE deliveries 
            SET assign_agent_id = :agentId, 
                status = :status 
            WHERE delivery_id = :deliveryId`;
                
        const agentBinds = {
            agentId: { val: agentId },
            status: { val: status },
            deliveryId: { val: deliveryId }
        };
        
        await connection.execute(agentQuery, agentBinds);
        
        // Update estimated date based on agent assignment
        const dateQuery = agentId === '' 
            ? `UPDATE deliveries SET estimated_date = NULL WHERE delivery_id = :deliveryId`
            : `UPDATE deliveries SET estimated_date = SYSDATE + 3 WHERE delivery_id = :deliveryId`;
            
        const dateBinds = {
            deliveryId: { val: deliveryId }
        };
        
        await connection.execute(dateQuery, dateBinds);
        
        await connection.commit();
        await connection.close();
        return { success: true };
    } catch (error) {
        console.error("Error assigning delivery agent:", error.message);
        return { success: false, message: error.message };
    }
}

const getDeliveryByAgentId = async (agentId) => {
    try {
        const connection = await getConnection();
        const query = `
        SELECT d.delivery_id, d.order_id, d.status, d.tracking_number, d.estimated_date, o.address, c.first_name || ' ' || c.last_name AS customer_name
        FROM deliveries d 
        JOIN Orders o ON d.order_id = o.order_id
        JOIN Customers c ON o.customer_id = c.customer_id
        WHERE d.assign_agent_id = :agentId
        ORDER BY d.delivery_id DESC`;
        const binds = { agentId };
        const result = await connection.execute(query, binds);
        const deliveries = result.rows.map((row) => {
            return {
                deliveryId: row[0],
                orderId: row[1],
                status: row[2],
                trackingNumber: row[3],
                estimatedDate: row[4],
                address: row[5],
                customerName: row[6]
            };
        });
        await connection.close();
        return deliveries;
    } catch (error) {
        console.error("Error fetching deliveries by agent ID:", error.message);
        return null;
    }
}

export default {
    addDelevery,
    getAllDeliveries,
    getDeliveryAgents,
    updateDeliveryStatus,
    assignDeliveryAgent,
    getDeliveryByAgentId
}