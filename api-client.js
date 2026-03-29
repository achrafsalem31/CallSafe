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

   // ... الكود الفوقاني كيبقا كيمها هو ...

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
 
    async login(email, password) { // تأكد من وجود { هنا
        try {
            const { data, error } = await supabaseClient
                .from('admin_users') 
                .select('password') 
                .eq('email', email) 
                .maybeSingle();

            if (error || !data) {
                console.error('Admin nicht gefunden');
                return false;
            }

            const bcrypt = window.bcrypt || (window.dcodeIO && window.dcodeIO.bcrypt);
            if (!bcrypt) {
                console.error('Bcrypt library not found!');
                return false;
            }
            
            return bcrypt.compareSync(password, data.password);
        } catch (e) {
            console.error('Login Error:', e);
            return false;
        }
    } // سدّة الدالة
}; // سدّة window.API

console.log('✅ API-Client ready with Login support');
