export type StudyForm = 'fullTime' | 'partTime';
export type StudyLanguage = 'kk' | 'ru' | 'en';
export type Gender = 'male' | 'female';
export type AcademicStatus = 'studying' | 'academicLeave' | 'graduate' | 'expelled';

export type StudentProfile = {
  fullName: string;
  photoUri: string | null;
  iin: string;
  studentId: string;
  birthDate: string; // Формат ДД.ММ.ГГГГ.
  gender: Gender;
  group: string;
  course: number;
  studyForm: StudyForm;
  studyLanguage: StudyLanguage;
  specialty: string;
  institute: string;
  department: string;
  academicStatus: AcademicStatus;
};