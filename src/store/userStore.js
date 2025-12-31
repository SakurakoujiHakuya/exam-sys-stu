import { create } from 'zustand';
import Cookies from 'js-cookie';
import userApi from '../api/user';

const useUserStore = create((set, get) => ({
  userName: Cookies.get('studentUserName') || '',
  userInfo: Cookies.get('studentUserInfo') ? JSON.parse(Cookies.get('studentUserInfo')) : null,
  imagePath: Cookies.get('studentImagePath') || '',
  messageCount: 0,

  initUserInfo: async () => {
    try {
      const re = await userApi.getCurrentUser();
      set({ userInfo: re.response });
      Cookies.set('studentUserInfo', re.response, { expires: 30 });
    } catch (error) {
      console.error('Failed to get user info:', error);
    }
  },

  getUserMessageInfo: async () => {
    try {
      const re = await userApi.getMessageCount();
      set({ messageCount: re.response });
    } catch (error) {
      console.error('Failed to get message count:', error);
    }
  },

  setUserName: (userName) => {
    set({ userName });
    Cookies.set('studentUserName', userName, { expires: 30 });
  },

  setUserInfo: (userInfo) => {
    set({ userInfo });
    Cookies.set('studentUserInfo', JSON.stringify(userInfo), { expires: 30 });
  },

  setImagePath: (imagePath) => {
    set({ imagePath });
    Cookies.set('studentImagePath', imagePath, { expires: 30 });
  },

  setMessageCount: (messageCount) => {
    set({ messageCount });
  },

  messageCountSubtract: (num) => {
    set({ messageCount: get().messageCount - num });
  },

  clearLogin: () => {
    Cookies.remove('studentUserName');
    Cookies.remove('studentUserInfo');
    Cookies.remove('studentImagePath');
    set({ userName: '', userInfo: null, imagePath: '', messageCount: 0 });
  }
}));

export default useUserStore;