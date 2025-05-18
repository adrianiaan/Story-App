import CONFIG from "../config";
import IdbService from "./idb-service";

const API_ENDPOINT = {
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  GET_ALL_STORIES: `${CONFIG.BASE_URL}/stories`,
  GET_DETAIL_STORY: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
  ADD_STORY: `${CONFIG.BASE_URL}/stories`,
  PUSH_SUBSCRIBE: `${CONFIG.BASE_URL}/notifications/subscribe`,
  PUSH_UNSUBSCRIBE: `${CONFIG.BASE_URL}/notifications/subscribe`,
};

class StoryApiService {
  static async register({ name, email, password }) {
    try {
      const response = await fetch(API_ENDPOINT.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      return response.json();
    } catch (error) {
      console.error("Error during registration:", error);
      return { error: true, message: "Terjadi kesalahan saat mendaftar" };
    }
  }

  static async login({ email, password }) {
    try {
      const response = await fetch(API_ENDPOINT.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      return response.json();
    } catch (error) {
      console.error("Error during login:", error);
      return { error: true, message: "Terjadi kesalahan saat login" };
    }
  }

  static async getAllStories(token, options = {}) {
    try {
      let url = API_ENDPOINT.GET_ALL_STORIES;

      // Tambahkan parameter query jika ada
      if (Object.keys(options).length > 0) {
        const queryParams = new URLSearchParams();

        if (options.location) {
          queryParams.append("location", "1");
        }

        if (options.size) {
          queryParams.append("size", options.size);
        }

        if (options.page) {
          queryParams.append("page", options.page);
        }

        url = `${url}?${queryParams.toString()}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseJson = await response.json();

      // Jika berhasil mendapatkan data dari API, simpan ke IndexedDB
      if (responseJson.error === false && responseJson.listStory) {
        await IdbService.saveStories(responseJson.listStory);
      }

      return responseJson;
    } catch (error) {
      console.error("Error fetching stories from API:", error);
      console.log("Trying to get stories from IndexedDB...");

      // Jika gagal mengambil dari API, coba ambil dari IndexedDB
      const stories = await IdbService.getStories();

      return {
        error: false,
        message: "Stories retrieved from local storage",
        listStory: stories,
        isFromCache: true,
      };
    }
  }

  static async getDetailStory(id, token) {
    try {
      const response = await fetch(API_ENDPOINT.GET_DETAIL_STORY(id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseJson = await response.json();

      // Jika berhasil mendapatkan data dari API, simpan ke IndexedDB
      if (responseJson.error === false && responseJson.story) {
        await IdbService.saveStory(responseJson.story);
      }

      return responseJson;
    } catch (error) {
      console.error(`Error fetching story with ID ${id} from API:`, error);
      console.log("Trying to get story from IndexedDB...");

      // Jika gagal mengambil dari API, coba ambil dari IndexedDB
      const story = await IdbService.getStoryById(id);

      if (story) {
        return {
          error: false,
          message: "Story retrieved from local storage",
          story,
          isFromCache: true,
        };
      }

      return {
        error: true,
        message: "Failed to get story and no cached version available",
      };
    }
  }

  static async addStory(formData, token) {
    try {
      const response = await fetch(API_ENDPOINT.ADD_STORY, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      return response.json();
    } catch (error) {
      console.error("Error adding story:", error);
      return {
        error: true,
        message: "Terjadi kesalahan saat menambahkan cerita",
      };
    }
  }

  // method untuk subscribe push notification
  static async subscribePushNotification(subscription, token) {
    try {
      const response = await fetch(API_ENDPOINT.PUSH_SUBSCRIBE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(subscription),
      });

      return response.json();
    } catch (error) {
      console.error("Error subscribing to push notification:", error);
      return {
        error: true,
        message: "Terjadi kesalahan saat berlangganan notifikasi",
      };
    }
  }

  // method untuk unsubscribe push notification
  static async unsubscribePushNotification(subscription, token) {
    try {
      const response = await fetch(API_ENDPOINT.PUSH_UNSUBSCRIBE, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(subscription),
      });

      return response.json();
    } catch (error) {
      console.error("Error unsubscribing from push notification:", error);
      return {
        error: true,
        message: "Terjadi kesalahan saat berhenti berlangganan notifikasi",
      };
    }
  }

  // method untuk menyimpan cerita ke IndexedDB offline
  static async addStory(formData, token) {
    try {
      const response = await fetch(API_ENDPOINT.ADD_STORY, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      return response.json();
    } catch (error) {
      console.error("Error adding story:", error);

      // Coba simpan story secara lokal jika offline
      try {
        // Ekstrak data dari FormData
        const description = formData.get("description");
        const photo = formData.get("photo");
        const lat = formData.get("lat");
        const lon = formData.get("lon");

        // Buat objek story untuk disimpan offline
        const pendingStory = {
          id: `pending-${Date.now()}`,
          description,
          photoData: photo, // Simpan data foto
          lat: lat ? parseFloat(lat) : null,
          lon: lon ? parseFloat(lon) : null,
          isPending: true,
          createdAt: new Date().toISOString(),
        };

        await IdbService.saveStory(pendingStory);
        console.log("Story saved locally for later upload");

        return {
          error: false,
          message: "Cerita disimpan secara lokal dan akan dikirim saat online",
          isPending: true,
        };
      } catch (idbError) {
        console.error("Error saving story to IndexedDB:", idbError);
        return {
          error: true,
          message: "Terjadi kesalahan saat menambahkan cerita",
        };
      }
    }
  }

  // Di dalam metode syncPendingStories
  static async syncPendingStories(token) {
    try {
      // Ambil semua story dari IndexedDB
      const stories = await IdbService.getStories();

      // Filter hanya story yang tertunda (isPending = true)
      const pendingStories = stories.filter((story) => story.isPending);

      if (pendingStories.length === 0) {
        console.log("No pending stories to sync");
        return { error: false, message: "No pending stories to sync" };
      }

      console.log(`Found ${pendingStories.length} pending stories to sync`);

      // Kirim semua story yang tertunda
      const results = await Promise.allSettled(
        pendingStories.map(async (story) => {
          try {
            // Buat FormData baru untuk setiap story
            const formData = new FormData();
            formData.append("description", story.description);

            // Tambahkan foto jika ada
            if (story.photoData) {
              // Jika photoData adalah Blob atau File, gunakan langsung
              if (
                story.photoData instanceof Blob ||
                story.photoData instanceof File
              ) {
                formData.append("photo", story.photoData);
              }
              // Jika photoData adalah string base64, konversi ke Blob
              else if (
                typeof story.photoData === "string" &&
                story.photoData.startsWith("data:")
              ) {
                const response = await fetch(story.photoData);
                const blob = await response.blob();
                formData.append("photo", blob, "photo.jpg");
              }
            }

            // Tambahkan lokasi jika ada
            if (story.lat !== null && story.lon !== null) {
              formData.append("lat", story.lat.toString());
              formData.append("lon", story.lon.toString());
            }

            // Kirim story ke server
            const response = await fetch(API_ENDPOINT.ADD_STORY, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            });

            const result = await response.json();

            if (!result.error) {
              // Hapus story dari IndexedDB jika berhasil dikirim
              await IdbService.deleteStory(story.id);
              console.log(`Successfully synced and deleted story ${story.id}`);
            }

            return result;
          } catch (error) {
            console.error(`Error syncing story ${story.id}:`, error);
            return { error: true, message: `Failed to sync story ${story.id}` };
          }
        })
      );

      // Hitung jumlah story yang berhasil dan gagal disinkronkan
      const successCount = results.filter(
        (r) => r.status === "fulfilled" && !r.value.error
      ).length;
      const failCount = pendingStories.length - successCount;

      return {
        error: false,
        message: `Synced ${successCount} stories, ${failCount} failed`,
        results,
      };
    } catch (error) {
      console.error("Error syncing pending stories:", error);
      return { error: true, message: "Failed to sync pending stories" };
    }
  }
}

export default StoryApiService;
