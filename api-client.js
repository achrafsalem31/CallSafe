const SUPABASE_URL = 'https://irfxrvincoaacwpialqp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyZnhydmluY29hYWN3cGlhbHFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MzIzMTYsImV4cCI6MjA4NjQwODMxNn0.o7GlOpeUoSl5aRmkZSKGhglIsYUMxmTEDtMswCJkQac';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

window.API = {
    // دالة البحث عن رقم
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

    // دالة التبليغ
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
 
    // دالة تسجيل الدخول (مصلحة لتناسب جدول Supabase الخاص بك)
    async login(email, password) { // زدنا { اللي كانت ناقصة
        try {
            const { data, error } = await supabaseClient
                .from('admin_users') 
                .select('password') // استعملنا اسم العمود password كما في الصورة
                .eq('email', email) 
                .maybeSingle();

            if (error || !data) {
                console.error('Admin nicht gefunden');
                return false;
            }

            // التأكد من وجود مكتبة التشفير
            const bcrypt = window.bcrypt || (window.dcodeIO && window.dcodeIO.bcrypt);
            if (!bcrypt) {
                console.error('Bcrypt Library missing!');
                return false;
            }

            // مقارنة الباسورد العادي مع الهاش المشفر من الداتابيز
            return bcrypt.compareSync(password, data.password);
        } catch (e) {
            console.error('Login Error:', e);
            return false;
        }
    }
};

console.log('✅ API-Client ready with corrected Login function');
