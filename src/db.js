// ==========================================
// نظام إدارة قاعدة البيانات السحابية - مدارس الشروق
// متصل مباشرة مع GitHub REST API (آمن ومشفر عبر السيرفر)
// ==========================================

// قراءة الرمز السري من بيئة التشغيل السحابية (Vercel) لمنع جيت هوب من حظره تلقائياً
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN || ""; 

const REPO_OWNER = "halasomy22-ai"; // اسم حسابك على جيت هوب
const REPO_NAME = "school-system";   // اسم المستودع
const FILE_PATH = "db.json";         // ملف قاعدة البيانات السحابي

// ✅ تم الإصلاح الفعلي والنهائي: الرابط البرمجي الصحيح والرسمي لـ API جيت هوب
const API_URL = `https://github.com{REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;

// دالة مساعدة داخلية لجلب محتويات الملف السحابي والبصمة (sha)
async function fetchCloudData() {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${GITHUB_TOKEN}`,
        "Accept": "application/vnd.github.v3+json",
        "Cache-Control": "no-cache"
      }
    });

    if (response.status === 404) {
      return { system_users: [], students_data: [], sha: null };
    }

    if (!response.ok) {
      throw new Error(`فشل في الاتصال بجيت هوب: ${response.status}`);
    }

    const data = await response.json();
    
    // فك التشفير الآمن لدعم النصوص العربية بوضوح دون تشويه
    const decodedText = decodeURIComponent(escape(atob(data.content)));
    const parsedData = JSON.parse(decodedText);

    return {
      system_users: parsedData.system_users || [],
      students_data: parsedData.students_data || [],
      sha: data.sha
    };
  } catch (error) {
    console.error("خطأ أثناء قراءة البيانات السحابية:", error);
    return { system_users: [], students_data: [], sha: null };
  }
}

// دالة مساعدة داخلية لحفظ الملف كاملاً على السحابة
async function saveCloudData(payload, sha) {
  try {
    const jsonString = unescape(encodeURIComponent(JSON.stringify(payload, null, 2)));
    const encodedContent = btoa(jsonString);

    const body = {
      message: "تحديث تلقائي سحابي لقاعدة بيانات مدرسة الشروق",
      content: encodedContent,
    };

    if (sha) {
      body.sha = sha;
    }

    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
        "Accept": "application/vnd.github.v3+json"
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`خطأ في الحفظ السحابي: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error("خطأ أثناء حفظ البيانات سحابياً:", error);
    throw error;
  }
}

// ==========================================
// أولاً: دوال إدارة مستخدمي النظام والصلاحيات
// ==========================================
