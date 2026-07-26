import { supabase } from './js/supabase.js';

// التقاط نموذج تسجيل الدخول عند الإرسال
const loginForm = document.querySelector('form');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // منع إعادة تحميل الصفحة التقليدي

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        
        // تغيير نص الزر أثناء عملية التحقق
        submitBtn.innerText = currentLang === 'ar' ? 'جاري التحقق...' : 'Verifying...';
        submitBtn.disabled = true;

        try {
            // محاولة تسجيل الدخول عبر Supabase Auth
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) throw error;

            // إذا تمت العملية بنجاح، توجيه المستخدم للوحة التحكم
            window.location.href = 'dashboard.html';

        } catch (error) {
            alert((currentLang === 'ar' ? 'خطأ في تسجيل الدخول: ' : 'Login Error: ') + error.message);
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }
    });
}
