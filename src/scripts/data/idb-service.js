import { openDB } from 'idb';
import CONFIG from '../config';

const { DATABASE_NAME, DATABASE_VERSION, OBJECT_STORE_NAME, SAVED_STORIES_STORE_NAME } = CONFIG;

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(database, oldVersion, newVersion, transaction) {
    if (!database.objectStoreNames.contains(OBJECT_STORE_NAME)) {
      database.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id' });
      console.log(`Object store ${OBJECT_STORE_NAME} berhasil dibuat`);
    }
    if (!database.objectStoreNames.contains(SAVED_STORIES_STORE_NAME)) {
      database.createObjectStore(SAVED_STORIES_STORE_NAME, { keyPath: 'id' });
      console.log(`Object store ${SAVED_STORIES_STORE_NAME} berhasil dibuat`);
    }
  },
});

const IdbService = {
  // Fungsi CRUD untuk stories
  async getStories() {
    try {
      const db = await dbPromise;
      return db.getAll(OBJECT_STORE_NAME);
    } catch (error) {
      console.error('Error getting stories from IndexedDB:', error);
      return [];
    }
  },

  async getStoryById(id) {
    try {
      const db = await dbPromise;
      return db.get(OBJECT_STORE_NAME, id);
    } catch (error) {
      console.error(`Error getting story with ID ${id} from IndexedDB:`, error);
      return null;
    }
  },

  async saveStories(stories) {
    try {
      const db = await dbPromise;
      const tx = db.transaction(OBJECT_STORE_NAME, 'readwrite');
      const store = tx.objectStore(OBJECT_STORE_NAME);
      await Promise.all(stories.map(story => store.put(story)));
      await tx.done;
      console.log('Stories saved to IndexedDB');
    } catch (error) {
      console.error('Error saving stories to IndexedDB:', error);
    }
  },

  async saveStory(story) {
    try {
      const db = await dbPromise;
      await db.put(OBJECT_STORE_NAME, story);
      console.log(`Story with ID ${story.id} saved to IndexedDB`);
    } catch (error) {
      console.error(`Error saving story with ID ${story.id} to IndexedDB:`, error);
    }
  },

  async deleteStory(id) {
    try {
      const db = await dbPromise;
      await db.delete(OBJECT_STORE_NAME, id);
      console.log(`Story with ID ${id} deleted from IndexedDB`);
    } catch (error) {
      console.error(`Error deleting story with ID ${id} from IndexedDB:`, error);
    }
  },

  async clearStories() {
    try {
      const db = await dbPromise;
      await db.clear(OBJECT_STORE_NAME);
      console.log('All stories cleared from IndexedDB');
    } catch (error) {
      console.error('Error clearing stories from IndexedDB:', error);
    }
  },

  // Fungsi CRUD untuk saved stories
  async getSavedStories() {
    try {
      const db = await dbPromise;
      return db.getAll(SAVED_STORIES_STORE_NAME);
    } catch (error) {
      console.error('Error getting saved stories from IndexedDB:', error);
      return [];
    }
  },

  async getSavedStoryById(id) {
    try {
      const db = await dbPromise;
      return db.get(SAVED_STORIES_STORE_NAME, id);
    } catch (error) {
      console.error(`Error getting saved story with ID ${id}:`, error);
      return null;
    }
  },

  async addSavedStory(story) {
    try {
      const db = await dbPromise;
      const savedStoryData = {
        ...story,
        savedAt: new Date().toISOString(),
      };
      await db.put(SAVED_STORIES_STORE_NAME, savedStoryData);
      console.log(`Story ${story.id} added to saved stories`);
      return { success: true };
    } catch (error) {
      console.error('Error adding saved story:', error);
      return { success: false, error };
    }
  },

  async removeSavedStory(id) {
    try {
      const db = await dbPromise;
      await db.delete(SAVED_STORIES_STORE_NAME, id);
      console.log(`Saved story ${id} removed`);
      return { success: true };
    } catch (error) {
      console.error('Error removing saved story:', error);
      return { success: false, error };
    }
  },

  async isSavedStory(id) {
    try {
      const savedStory = await this.getSavedStoryById(id);
      return !!savedStory;
    } catch (error) {
      console.error('Error checking saved story status:', error);
      return false;
    }
  },

  async clearSavedStories() {
    try {
      const db = await dbPromise;
      await db.clear(SAVED_STORIES_STORE_NAME);
      console.log('All saved stories cleared');
      return { success: true };
    } catch (error) {
      console.error('Error clearing saved stories:', error);
      return { success: false, error };
    }
  },
};

export default IdbService;
