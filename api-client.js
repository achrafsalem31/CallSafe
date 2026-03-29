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
            // حفظ التوكن والمعلومات في localStorage
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
    },

    // 5. جلب الإحصائيات (هادي اللي كانت ناقصاك)
    async getStatistics() {
        try {
            const response = await fetch(`${API_URL}/numbers/stats`);
            if (!response.ok) throw new Error('Fehler beim Laden der Stats');
            return await response.json();
        } catch (e) {
            console.error('Stats Error:', e);
            return { totalReports: 0, totalNumbers: 0, byCategory: {} };
        }
    },

    // 6. جلب جميع الأرقام للقائمة (ضرورية لصفحة الإدارة)
    async getAllNumbers() {
        try {
            const response = await fetch(`${API_URL}/numbers`);
            if (!response.ok) throw new Error('Fehler beim Laden der Nummern');
            return await response.json();
        } catch (e) {
            console.error('Numbers List Error:', e);
            return [];
        }
    }
};

console.log('✅ API-Client updated with Statistics and Numbers support');
