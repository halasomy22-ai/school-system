// ==========================================
// نظام إدارة قاعدة البيانات - مدارس الشروق
// متصل مع Firebase Firestore في السحابة
// ==========================================

import { db } from './firebase.js';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query,
  where 
} from 'firebase/firestore';

const USERS_COLLECTION = 'system_users';
const STUDENTS_COLLECTION = 'students_data';

// ==========================================
// أولاً: دوال إدارة مستخدمي النظام والصلاحيات
// ==========================================

// جلب جميع مستخدمي النظام
export const getAllSystemUsers = async () => {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const snapshot = await getDocs(usersRef);
    const users = [];
    snapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return users;
  } catch (error) {
    console.error("خطأ في جلب بيانات المستخدمين:", error);
    throw error;
  }
};

// إضافة أو تحديث مستخدم في النظام
export const addSystemUser = async (user) => {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    
    // إذا كان المستخدم يملك id (تحديث)
    if (user.id) {
      const userDocRef = doc(db, USERS_COLLECTION, user.id);
      await updateDoc(userDocRef, user);
      return user.id;
    } else {
      // إضافة مستخدم جديد
      const docRef = await addDoc(usersRef, user);
      return docRef.id;
    }
  } catch (error) {
    console.error("خطأ في حفظ بيانات المستخدم:", error);
    throw error;
  }
};

// حذف مستخدم من النظام
export const deleteSystemUser = async (id) => {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, id);
    await deleteDoc(userDocRef);
    return true;
  } catch (error) {
    console.error("خطأ في حذف المستخدم:", error);
    throw error;
  }
};

// البحث عن مستخدم باسم الدخول
export const findUserByLoginName = async (loginName) => {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(usersRef, where('loginName', '==', loginName));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    }
    return null;
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
    const studentsRef = collection(db, STUDENTS_COLLECTION);
    const snapshot = await getDocs(studentsRef);
    const students = [];
    snapshot.forEach(doc => {
      students.push({ id: doc.id, ...doc.data() });
    });
    return students;
  } catch (error) {
    console.error("خطأ في جلب بيانات الطلاب:", error);
    throw error;
  }
};

// إضافة أو تحديث بيانات طالب
export const addStudent = async (student) => {
  try {
    const studentsRef = collection(db, STUDENTS_COLLECTION);
    
    if (student.id) {
      const studentDocRef = doc(db, STUDENTS_COLLECTION, student.id);
      await updateDoc(studentDocRef, student);
      return student.id;
    } else {
      const docRef = await addDoc(studentsRef, student);
      return docRef.id;
    }
  } catch (error) {
    console.error("خطأ في حفظ بيانات الطالب:", error);
    throw error;
  }
};

// حذف طالب من النظام
export const deleteStudent = async (id) => {
  try {
    const studentDocRef = doc(db, STUDENTS_COLLECTION, id);
    await deleteDoc(studentDocRef);
    return true;
  } catch (error) {
    console.error("خطأ في حذف الطالب:", error);
    throw error;
  }
};
