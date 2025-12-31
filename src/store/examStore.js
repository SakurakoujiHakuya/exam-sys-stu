import { create } from 'zustand';
import subjectApi from '../api/subject';

const useExamStore = create((set, get) => ({
  subjects: [],

  subjectEnumFormat: (key) => {
    const subjects = get().subjects;
    for (let item of subjects) {
      if (item.id === key) {
        return `${item.name} ( ${item.levelName} )`;
      }
    }
    return null;
  },

  initSubject: async () => {
    try {
      const re = await subjectApi.list();
      set({ subjects: re.response });
    } catch (error) {
      console.error('Failed to get subjects:', error);
    }
  },

  setSubjects: (subjects) => {
    set({ subjects });
  }
}));

export default useExamStore;