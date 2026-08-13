// ==========================================
// نظام إدارة قاعدة البيانات السحابية - مدارس الشروق
// متصل مباشرة مع GitHub REST API
// ==========================================

// ⚙️ ضع هنا البيانات الخاصة بحسابك ومستودعك والـ Token الذي استخرجته
const GITHUB_TOKEN = "ضع_هنا_الرمز_السري_الذي_نسخته"; 
const REPO_OWNER = "halasomy22-ai"; // اسم حسابك كما يظهر بالصورة
const REPO_NAME = "school-system";   // اسم المستودع كما يظهر بالصورة
const FILE_PATH = "db.json";         // اسم الملف الذي أنشأناه في الخطوة الأولى

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

    if (!response.ok) {
      throw new Error("فشل في الاتصال بجيت هوب");
    }

    const data = await response.json();
    
    // فك التشفير الآمن لدعم النصوص العربية بوضوح
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
      message: "تحديث تلقائي لقاعدة بيانات المدرسة",
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

export const getAllSystemUsers = async () => {
  const { system_users } = await fetchCloudData();
  return system_users;
};

export const addSystemUser = async (user) => {
  try {
    const { system_users, students_data, sha } = await fetchCloudData();
    
    if (user.id) {
      const index = system_users.findIndex(u => u.id === user.id);
      if (index !== -1) system_users[index] = user;
    } else {
      user.id = Date.now().toString();
      system_users.push(user);
    }
    
    await saveCloudData({ system_users, students_data }, sha);
    return user.id;
  } catch (error) {
    console.error("خطأ في حفظ المستخدم:", error);
    throw error;
  }
};

export const deleteSystemUser = async (id) => {
  try {
    const { system_users, students_data, sha } = await fetchCloudData();
    const filtered = system_users.filter(u => u.id !== id);
    
    await saveCloudData({ system_users: filtered, students_data }, sha);
    return true;
  } catch (error) {
    console.error("خطأ في حذف المستخدم:", error);
    throw error;
  }
};

export const findUserByLoginName = async (loginName) => {
  const users = await getAllSystemUsers();
  return users.find(u => u.loginName === loginName) || null;
};

// ==========================================
// ثانياً: دوال إدارة بيانات الطلاب
// ==========================================

export const getAllStudents = async () => {
  const { students_data } = await fetchCloudData();
  return students_data;
};

export const addStudent = async (student) => {
  try {
    const { system_users, students_data, sha } = await fetchCloudData();
    
    if (student.id) {
      const index = students_data.findIndex(s => s.id === student.id);
      if (index !== -1) students_data[index] = student;
    } else {
      student.id = Date.now().toString();
      students_data.push(student);
    }
    
    await saveCloudData({ system_users, students_data }, sha);
    return student.id;
  } catch (error) {
    console.error("خطأ في حفظ بيانات الطالب:", error);
    throw error;
  }
};

export const deleteStudent = async (id) => {
  try {
    const { system_users, students_data, sha } = await fetchCloudData();
    const filtered = students_data.filter(s => s.id !== id);
    
    await saveCloudData({ system_users, students_data: filtered }, sha);
    return true;
  } catch (error) {
    console.error("خطأ في حذف الطالب:", error);
    throw error;
  }
};
