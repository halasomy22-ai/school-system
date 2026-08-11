// ==========================================
// نظام إدارة قاعدة البيانات المحلية - مدارس الشروق
// متصل ومستقل بالكامل ويعمل عبر جيت هوب فقط
// ==========================================

const DB_NAME = 'ShoroukSchoolDB';
const DB_VERSION = 1;
const USERS_STORE = 'system_users';
const STUDENTS_STORE = 'students_data';

// 1. دالة تهيئة وتأسيس قاعدة البيانات المحلية في المتصفح
export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // إنشاء مخزن مستخدمي النظام والصلاحيات
      if (!db.objectStoreNames.contains(USERS_STORE)) {
        db.createObjectStore(USERS_STORE, { keyPath: 'id', autoIncrement: true });
      }
      // إنشاء مخزن بيانات الطلاب
      if (!db.objectStoreNames.contains(STUDENTS_STORE)) {
        db.createObjectStore(STUDENTS_STORE, { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
};

// ==========================================
// أولاً: دوال إدارة مستخدمي النظام والصلاحيات
// ==========================================

// جلب جميع مستخدمي النظام
export const getAllSystemUsers = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(USERS_STORE, 'readonly');
    const store = transaction.objectStore(USERS_STORE);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
};

// إضافة أو تحديث مستخدم في النظام
export const addSystemUser = async (user) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(USERS_STORE, 'readwrite');
    const store = transaction.objectStore(USERS_STORE);
    const request = store.put(user);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// حذف مستخدم من النظام
export const deleteSystemUser = async (id) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(USERS_STORE, 'readwrite');
    const store = transaction.objectStore(USERS_STORE);
    const request = store.delete(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// ==========================================
// ثانياً: دوال إدارة بيانات الطلاب
// ==========================================

// جلب جميع الطلاب
export const getAllStudents = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STUDENTS_STORE, 'readonly');
    const store = transaction.objectStore(STUDENTS_STORE);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
};

// إضافة أو تحديث بيانات طالب
export const addStudent = async (student) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STUDENTS_STORE, 'readwrite');
    const store = transaction.objectStore(STUDENTS_STORE);
    const request = store.put(student);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// حذف طالب من النظام
export const deleteStudent = async (id) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STUDENTS_STORE, 'readwrite');
    const store = transaction.objectStore(STUDENTS_STORE);
    const request = store.delete(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};
