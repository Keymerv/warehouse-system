import { supabase } from './supabase.js';

const loginForm = document.getElementById('login-form');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // منع إعادة تحميل الصفحة أو تحويلها تلقائياً

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        
        // التحقق من أن الحقول ليست فارغة
        if (!email || !password) {
            alert('الرجاء إدخال البريد الإلكتروني وكلمة المرور');
            return;
        }

        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'جاري التحقق...';
        submitBtn.disabled = true;

        try {
            // محاولة تسجيل الدخول عبر Supabase Auth
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                throw error; // رمي الخطأ في حال كانت البيانات غير صحيحة
            }

            // إذا تم التحقق بنجاح من قاعدة البيانات، يتم التوجيه للوحة التحكم
            window.location.href = 'dashboard.html';

        } catch (error) {
            // إظهار رسالة الخطأ ومنع الدخول نهائياً
            alert('خطأ في تسجيل الدخول: ' + (error.message || 'بيانات الاعتماد غير صحيحة'));
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }
    });
}
