// 1. إعداد رابط السيرفر المحلي (Node.js)
const API_URL = 'http://localhost:3000/api';

window.API = {
    // 2. تسجيل الدخول (Login)
    async login(email, password) {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // حفظ التوكن والمعلومات في localStorage (مهم بزاف للـ Admin Check)
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            return data;
        } else {
            throw new Error(data.error || 'Login fehlgeschlagen');
        }
    },

    // 3. فحص الأرقام (Check Number)
    async checkNumber(phoneNumber) {
        try {
            // تحويل الرقم لشكل مناسب للرابط (URL Encode)
            const encodedPhone = encodeURIComponent(phoneNumber);
            const response = await fetch(`${API_URL}/numbers/check/${encodedPhone}`);
            return await response.json();
        } catch (e) {
            console.error('Error checking number:', e);
            return null;
        }
    },

    // 4. التبليغ عن رقم (Submit Report)
    async reportNumber(phone, category, details) {
        try {
            const response = await fetch(`${API_URL}/reports`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ phone, category, details })
            });
            return response.ok;
        } catch (e) {
            console.error('Error reporting number:', e);
            return false;
        }
    }
};

console.log('✅ Frontend API-Client switched to Node.js Backend');
