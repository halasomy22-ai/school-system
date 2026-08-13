// ==========================================
// نظام إدارة قاعدة البيانات - مدارس الشروق
// متصل مع LocalStorage بشكل محلي
// ==========================================

const USERS_COLLECTION = 'system_users';
const STUDENTS_COLLECTION = 'students_data';

// ==========================================
// أولاً: دوال إدارة مستخدمي النظام والصلاحيات
// ==========================================

// جلب جميع مستخدمي النظام
export const getAllSystemUsers = async () => {
  try {
    const users = localStorage.getItem(USERS_COLLECTION);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error("خطأ في جلب بيانات المستخدمين:", error);
    return [];
  }
};

// إضافة أو تحديث مستخدم في النظام
export const addSystemUser = async (user) => {
  try {
    const users = await getAllSystemUsers();
    
    if (user.id) {
      const index = users.findIndex(u => u.id === user.id);
      if (index !== -1) {
        users[index] = user;
      }
    } else {
      user.id = Date.now().toString();
      users.push(user);
    }
    
    localStorage.setItem(USERS_COLLECTION, JSON.stringify(users));
    return user.id;
  } catch (error) {
    console.error("خطأ في حفظ بيانات المستخدم:", error);
    throw error;
  }
};

// حذف مستخدم من النظام
export const deleteSystemUser = async (id) => {
  try {
    const users = await getAllSystemUsers();
    const filtered = users.filter(u => u.id !== id);
    localStorage.setItem(USERS_COLLECTION, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error("خطأ في حذف المستخدم:", error);
    throw error;
  }
};

// البحث عن مستخدم باسم الدخول
export const findUserByLoginName = async (loginName) => {
  try {
    const users = await getAllSystemUsers();
    return users.find(u => u.loginName === loginName) || null;
  } catch (error) {
    console.error("خطأ في البحث عن المستخدم:", error);
    throw error;
  }
};

// ==========================================
// ثانياً: دوال إدارة بيانات الطلاب
// ==========================================

// جلب جميع الطلاب
export const getAllStudents = async () => {
  try {
    const students = localStorage.getItem(STUDENTS_COLLECTION);
    return students ? JSON.parse(students) : [];
  } catch (error) {
    console.error("خطأ في جلب بيانات الطلاب:", error);
    return [];
  }
};

// إضافة أو تحديث بيانات طالب
export const addStudent = async (student) => {
  try {
    const students = await getAllStudents();
    
    if (student.id) {
      const index = students.findIndex(s => s.id === student.id);
      if (index !== -1) {
        students[index] = student;
      }
    } else {
      student.id = Date.now().toString();
      students.push(student);
    }
    
    localStorage.setItem(STUDENTS_COLLECTION, JSON.stringify(students));
    return student.id;
  } catch (error) {
    console.error("خطأ في حفظ بيانات الطالب:", error);
    throw error;
  }
};

// حذف طالب من النظام
export const deleteStudent = async (id) => {
  try {
    const students = await getAllStudents();
    const filtered = students.filter(s => s.id !== id);
    localStorage.setItem(STUDENTS_COLLECTION, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error("خطأ في حذف الطالب:", error);
    throw error;
  }
};
