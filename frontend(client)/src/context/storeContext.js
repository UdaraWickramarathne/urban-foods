import {create} from 'zustand';
import { PRODUCTS, VALIDATE_TOKEN } from './constants';
import axios from 'axios';

const storeContext = create((set, get) =>({
    token: localStorage.getItem('token') || '',
    userId: localStorage.getItem('userId') || '',
    role: localStorage.getItem('role') || '',
    setToken: (token) => {
        localStorage.setItem('token', token);
        set({token});
    },
    setUserId: (userId) => {
        localStorage.setItem('userId', userId);
        set({userId});
    },
    setRole: (role) => {
        localStorage.setItem('role', role);
        set({role});
    },
    validateToken: async () => {
        const {token, setToken, setUserId} = get();
        try {
            const response = await fetch(VALIDATE_TOKEN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.status === 200) {
                setToken(token);
                setUserId(data.userId);
            }
        } catch (error) {
            console.error("Failed to validate token:", error);
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            set({ token: "", userId: "" });
        }
    },
    // get products
    getAllProducts: async () => {
        try {
          const response = await axios.get(PRODUCTS);
          return response.data;
        } catch (error) {
          if (error.response) {
            return error.response.data;
          }
          return { success: false, message: error.message };
        }
    },
}))

export default storeContext;