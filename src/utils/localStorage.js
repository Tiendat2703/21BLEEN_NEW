// localStorage utility functions

const STORAGE_KEYS = {
  PASSWORD: 'love_app_password',
  PERSON_1: 'love_app_person1',
  PERSON_2: 'love_app_person2',
  IMAGES: 'love_app_images',
  MESSAGE: 'love_app_message',
  AUDIO: 'love_app_audio',
  VIDEO: 'love_app_video',
};

// Password
export const savePassword = (password) => {
  localStorage.setItem(STORAGE_KEYS.PASSWORD, password);
};

export const getPassword = () => {
  return localStorage.getItem(STORAGE_KEYS.PASSWORD);
};

// Person Information
export const savePerson = (personNumber, data) => {
  const key = personNumber === 1 ? STORAGE_KEYS.PERSON_1 : STORAGE_KEYS.PERSON_2;
  localStorage.setItem(key, JSON.stringify(data));
};

export const getPerson = (personNumber) => {
  const key = personNumber === 1 ? STORAGE_KEYS.PERSON_1 : STORAGE_KEYS.PERSON_2;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

// Images
export const saveImages = (images) => {
  localStorage.setItem(STORAGE_KEYS.IMAGES, JSON.stringify(images));
};

export const getImages = () => {
  const data = localStorage.getItem(STORAGE_KEYS.IMAGES);
  return data ? JSON.parse(data) : [];
};

// Message
export const saveMessage = (message) => {
  localStorage.setItem(STORAGE_KEYS.MESSAGE, message);
};

export const getMessage = () => {
  return localStorage.getItem(STORAGE_KEYS.MESSAGE) || '';
};

// Audio
export const saveAudio = (audioData) => {
  localStorage.setItem(STORAGE_KEYS.AUDIO, audioData);
};

export const getAudio = () => {
  return localStorage.getItem(STORAGE_KEYS.AUDIO);
};

// Video
export const saveVideo = (videoData) => {
  localStorage.setItem(STORAGE_KEYS.VIDEO, JSON.stringify(videoData));
};

export const getVideo = () => {
  const data = localStorage.getItem(STORAGE_KEYS.VIDEO);
  return data ? JSON.parse(data) : null;
};


