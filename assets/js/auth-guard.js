import { supabase } from './supabase.js';

// دالة فحص الجلسة المركزية لأي صفحة محمية
async function protectRoute() {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    // إذا لم تكن هناك جلسة نشطة أو حدث خطأ في المصادقة
    if (error || !session) {
        // توجيه فوري لصفحة تسجيل الدخول ومنع عرض أي محتوى بالصفحة
        window.location.href = 'login.html';
    }
}

// تنفيذ الحماية فور تحميل الصفحة
protectRoute();
