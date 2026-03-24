const SUPABASE_URL = 'https://irfxrvincoaacwpialqp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyZnhydmluY29hYWN3cGlhbHFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MzIzMTYsImV4cCI6MjA4NjQwODMxNn0.o7GlOpeUoSl5aRmkZSKGhglIsYUMxmTEDtMswCJkQac';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

window.API = {
 
    async checkNumber(phoneNumber) {
        try {
            const { data, error } = await supabaseClient
                .from('numbers')
                .select('*')
                .eq('phone', phoneNumber)
                .maybeSingle();

            if (error) throw error;
            return data;
        } catch (e) {
            console.error('API Error (Check):', e);
            return null;
        }
    },

    async reportNumber(phone, category, details) {
        try {
            const { error } = await supabaseClient
                .from('reports')
                .insert([{ phone, category, details }]);
            
            return !error;
        } catch (e) {
            console.error('API Error (Report):', e);
            return false;
        }
    },
 
    async login(username, password) {
        try {
            const { data, error } = await supabaseClient
                .from('admin_users') 
                .select('password_hash')
                .eq('username', username)
                .maybeSingle();

            if (error || !data) return false;

            return data.password_hash === password; 
        } catch (e) {
            console.error('Login Error:', e);
            return false;
        }
    }
};

console.log('✅ API-Client ready with Login support');
