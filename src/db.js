import { createClient } from '@supabase/supabase-js';

// الروابط والمفاتيح السحابية السرية والحقيقية لمشروع AlShorouk
const supabaseUrl = 'https://supabase.co';
const supabaseKey = 'sb_secret_voSi9g6FajwmvL-tnxIvVw_WfrlyZ3A';

export const supabase = createClient(supabaseUrl, supabaseKey);

const DB_NAME = 'SchoolDB';
const DB_VERSION = 3; 
const STORE_NAME = 'students';
const TEACHERS_STORE = 'teachers'; 
const TRANSACTIONS_STORE = 'transactions';

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = (event) => reject(event.target.error);
    request.onsuccess = (event) => resolve(event.target.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(TEACHERS_STORE)) {
        db.createObjectStore(TEACHERS_STORE, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(TRANSACTIONS_STORE)) {
        db.createObjectStore(TRANSACTIONS_STORE, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
};

/* ================= دوال التحكم في الطلاب ================= */
export const addStudent = async (student) => {
  try {
    const { error } = await supabase.from('students').insert([{ data: student }]);
    if (error) throw error;
  } catch (e) {
    console.error("خطأ في الحفظ السحابي، جاري الحفظ محلياً:", e);
  }
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(student);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getAllStudents = async () => {
  try {
    const { data, error } = await supabase.from('students').select('*');
    if (error) throw error;
    if (data && data.length > 0) {
      return data.map(item => ({ id: item.id, ...item.data }));
    }
  } catch (e) {
    console.error("خطأ في جلب البيانات:", e);
  }
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const deleteStudent = async (id) => {
  try {
    const { error } = await supabase.from('students').delete().eq('id', id);
    if (error) throw error;
  } catch (e) {
    console.error(e);
  }
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

/* ================= دوال التحكم في المعلمين ================= */
export const addTeacher = async (teacher) => {
  try {
    const { error } = await supabase.from('teachers').insert([{ data: teacher }]);
    if (error) throw error;
  } catch (e) {
    console.error(e);
  }
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(TEACHERS_STORE, 'readwrite');
    const store = transaction.objectStore(TEACHERS_STORE);
    const request = store.add(teacher);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getAllTeachers = async () => {
  try {
    const { data, error } = await supabase.from('teachers').select('*');
    if (error) throw error;
    if (data && data.length > 0) {
      return data.map(item => ({ id: item.id, ...item.data }));
    }
  } catch (e) {
    console.error(e);
  }
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(TEACHERS_STORE, 'readonly');
    const store = transaction.objectStore(TEACHERS_STORE);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const deleteTeacher = async (id) => {
  try {
    const { error } = await supabase.from('teachers').delete().eq('id', id);
    if (error) throw error;
  } catch (e) {
    console.error(e);
  }
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(TEACHERS_STORE, 'readwrite');
    const store = transaction.objectStore(TEACHERS_STORE);
    const request = store.delete(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

/* ================= دوال التحكم في المعاملات المالية ================= */
export const addTransaction = async (trans) => {
  try {
    const { error } = await supabase.from('transactions').insert([{ data: trans }]);
    if (error) throw error;
  } catch (e) {
    console.error(e);
  }
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(TRANSACTIONS_STORE, 'readwrite');
    const store = transaction.objectStore(TRANSACTIONS_STORE);
    const request = store.add(trans);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getAllTransactions = async () => {
  try {
    const { data, error } = await supabase.from('transactions').select('*');
    if (error) throw error;
    if (data && data.length > 0) {
      return data.map(item => ({ id: item.id, ...item.data }));
    }
  } catch (e) {
    console.error(e);
  }
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(TRANSACTIONS_STORE, 'readonly');
    const store = transaction.objectStore(TRANSACTIONS_STORE);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

/* ================= دوال التحكم في مستخدمي النظام والمسؤولين ================= */
export const addSystemUser = async (user) => {
  try {
    const { error } = await supabase.from('users').insert([{ data: user }]);
    if (error) throw error;
  } catch (e) {
    console.error("خطأ في حفظ المستخدم سحابياً:", e);
  }
  const db = await initDB();
  return new Promise((resolve, reject) => {
    if (!db.objectStoreNames.contains('users')) { resolve(null); return; }
    const transaction = db.transaction('users', 'readwrite');
    const store = transaction.objectStore('users');
    const request = store.add(user);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getAllSystemUsers = async () => {
  try {
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw error;
    if (data && data.length > 0) {
      return data.map(item => ({ id: item.id, ...item.data }));
    }
  } catch (e) {
    console.error("خطأ في جلب المستخدمين:", e);
  }
  const db = await initDB();
  return new Promise((resolve, reject) => {
    if (!db.objectStoreNames.contains('users')) { resolve([]); return; }
    const transaction = db.transaction('users', 'readonly');
    const store = transaction.objectStore('users');
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};
