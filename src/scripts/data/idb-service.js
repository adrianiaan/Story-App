import { openDB } from 'idb';
import CONFIG from '../config';

const { DATABASE_NAME, DATABASE_VERSION, OBJECT_STORE_NAME } = CONFIG;

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(database) {
    // Buat object store jika belum ada
    if (!database.objectStoreNames.contains(OBJECT_STORE_NAME)) {
      database.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id' });
      console.log(`Object store ${OBJECT_STORE_NAME} berhasil dibuat`);
    }
  },
});

const IdbService = {
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
      
      // Simpan setiap cerita
      await Promise.all(stories.map(story => store.put(story)));
      
      await tx.complete;
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
};

export default IdbService;