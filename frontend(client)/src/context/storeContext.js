import {create} from 'zustand';
import { VALIDATE_TOKEN } from './constants';

const storeContext = create((set, get) =>({
    token: localStorage.getItem('token') || '',
    userId: localStorage.getItem('userId') || '',
    setToken: (token) => {
        localStorage.setItem('token', token);
        set({token});
    },
    setUserId: (userId) => {
        localStorage.setItem('userId', userId);
        set({userId});
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
    }
}))

export default storeContext;