

const API_URL = 'http://localhost:3000/api';

function getToken() {
    return localStorage.getItem('token');
}


async function login(email, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            return { success: true, user: data.user };
        } else {
            return { success: false, error: data.error };
        }
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: 'Verbindungsfehler' };
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

function isLoggedIn() {
    return !!localStorage.getItem('token');
}

function isAdmin() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role === 'admin';
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
}



async function checkNumberInDB(phoneNumber) {
    try {
        const encodedPhone = encodeURIComponent(phoneNumber);
        const response = await fetch(`${API_URL}/numbers/check/${encodedPhone}`);
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.error);
        
        if (!data.found) {
            return {
                status: 'warning',
                title: '⚠️ UNBEKANNT',
                reason: 'Diese Nummer wurde noch nicht gemeldet.',
                category: 'Unbekannt',
                action: 'Vorsichtig sein!'
            };
        }
        
        const titles = {
            safe: '✅ UNAUFFÄLLIG',
            warning: '⚠️ VORSICHT',
            danger: '🚨 BETRUG BESTÄTIGT'
        };
        
        return {
            status: data.status,
            title: titles[data.status] || '⚠️ UNBEKANNT',
            reason: data.message,
            category: data.data?.category || 'Unbekannt',
            action: data.status === 'danger' 
                ? 'Sofort auflegen!' 
                : 'Vorsichtig sein!'
        };
        
    } catch (error) {
        console.error('Check error:', error);
        return {
            status: 'warning',
            title: '⚠️ FEHLER',
            reason: 'Fehler beim Abrufen',
            category: '',
            action: 'Später erneut versuchen'
        };
    }
}

async function reportNumberToDB(phoneNumber, category, details = '') {
    try {
        const response = await fetch(`${API_URL}/reports`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone: phoneNumber,
                category: category || 'sonstiges',
                details: details
            })
        });
        
        if (response.ok) {
            console.log('✅ Report gespeichert');
            return true;
        } else {
            console.error('❌ Fehler beim Melden');
            return false;
        }
    } catch (error) {
        console.error('Report error:', error);
        return false;
    }
}

async function getStatisticsFromDB() {
    try {
        const response = await fetch(`${API_URL}/numbers/stats`);
        const data = await response.json();
        
        if (response.ok) {
            // Backend gibt { stats: {...} } zurück
            return data.stats || data;
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Stats error:', error);
        return {
            totalNumbers: 0,
            totalReports: 0,
            byCategory: {}
        };
    }
}

async function getAllNumbersFromDB() {
    try {
        const token = getToken();
        
        const headers = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(`${API_URL}/numbers`, { headers });
        const data = await response.json();
        
        if (response.ok) {
            return data.numbers || [];
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Get numbers error:', error);
        return [];
    }
}

async function searchNumbersInDB(searchTerm) {
    try {
        const numbers = await getAllNumbersFromDB();
        
        // Frontend-Suche
        return numbers.filter(n => 
            n.phone && n.phone.includes(searchTerm)
        );
    } catch (error) {
        console.error('Search error:', error);
        return [];
    }
}


window.API = {
    login,
    logout,
    isLoggedIn,
    isAdmin,
    getCurrentUser,
    checkNumber: checkNumberInDB,
    reportNumber: reportNumberToDB,
    getStatistics: getStatisticsFromDB,
    getAllNumbers: getAllNumbersFromDB,
    searchNumbers: searchNumbersInDB
};

window.DB = {
    checkNumber: checkNumberInDB,
    reportNumber: reportNumberToDB,
    getStatistics: getStatisticsFromDB,
    getAllNumbers: getAllNumbersFromDB,
    searchNumbers: searchNumbersInDB
};

console.log('✅ API Client geladen');
console.log('📊 Backend:', API_URL);
console.log('🔌 window.API & window.DB bereit!');
