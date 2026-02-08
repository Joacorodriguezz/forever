const API_URL = 'http://localhost:3000/api';

async function reproduce() {
    try {
        // 1. Login to get token
        console.log('Logging in...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@club.com',
                password: 'Admin123'
            })
        });
        const loginData: any = await loginRes.json();
        if (!loginRes.ok) {
            throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
        }
        const token = loginData.data.token;
        console.log('Login successful.');

        // 2. Try to generate cuotas with "año"
        console.log('Attempting to generate cuotas with "año"...');
        const res = await fetch(`${API_URL}/cuotas/generar-mensual`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mes: 3, año: 2026 })
        });

        const data: any = await res.json();
        console.log('Response Status:', res.status);
        console.log('Response Body:', JSON.stringify(data, null, 2));

    } catch (error: any) {
        console.error('Failed to run reproduction script:', error.message);
    }
}

reproduce();
