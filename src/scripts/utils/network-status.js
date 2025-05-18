import StoryApiService from "../data/api";
import AuthUtils from "./auth-utils";

const NetworkStatus = {
  init({ connectionStatusElement }) {
    this._connectionStatusElement = connectionStatusElement;
    this._initNetworkStatus();
  },

  _initNetworkStatus() {
    window.addEventListener("online", () => {
      this._updateNetworkStatus(true);
      this._syncDataWhenOnline(); // Tambahkan ini
    });

    window.addEventListener("offline", () => {
      this._updateNetworkStatus(false);
    });

    // Cek status awal
    this._updateNetworkStatus(navigator.onLine);

    // Jika online saat inisialisasi, coba sinkronisasi data
    if (navigator.onLine) {
      this._syncDataWhenOnline(); // Tambahkan ini
    }
  },

  _updateNetworkStatus(isOnline) {
    if (!this._connectionStatusElement) return;

    if (isOnline) {
      this._connectionStatusElement.textContent = "Online";
      this._connectionStatusElement.classList.remove("offline");
      this._connectionStatusElement.classList.add("online");

      // Sembunyikan setelah beberapa detik
      setTimeout(() => {
        this._connectionStatusElement.classList.add("hidden");
      }, 3000);
    } else {
      this._connectionStatusElement.textContent =
        "Offline - Beberapa fitur mungkin tidak tersedia";
      this._connectionStatusElement.classList.remove("online", "hidden");
      this._connectionStatusElement.classList.add("offline");
    }
  },

  async _syncDataWhenOnline() {
    try {
      console.log("Checking for data to sync...");

      // Periksa apakah user sudah login
      const { token } = AuthUtils.getAuth();
      if (!token) {
        console.log("User not logged in, skipping sync");
        return;
      }

      // Sinkronisasi cerita yang tertunda
      console.log("Syncing pending stories...");
      const syncResult = await StoryApiService.syncPendingStories(token);

      if (syncResult.error) {
        console.error("Failed to sync pending stories:", syncResult.message);
      } else if (syncResult.results && syncResult.results.length > 0) {
        console.log("Sync completed:", syncResult.message);

        // Tampilkan notifikasi jika ada cerita yang berhasil disinkronkan
        const successCount = syncResult.results.filter(
          (r) => r.status === "fulfilled" && !r.value.error
        ).length;
        if (successCount > 0) {
          this._showSyncNotification(successCount);

          // Tambahkan ini untuk menampilkan toast notification
          this._showToastNotification(
            `${successCount} cerita berhasil disinkronkan`
          );
        }
      } else {
        console.log("No pending stories to sync");
      }
    } catch (error) {
      console.error("Error during data sync:", error);
    }
  },

  _showSyncNotification(count) {
    // Periksa apakah browser mendukung notifikasi
    if (!("Notification" in window)) {
      return;
    }

    // Periksa izin notifikasi
    if (Notification.permission === "granted") {
      new Notification("Story App", {
        body: `${count} cerita berhasil disinkronkan`,
        icon: "/favicon.png",
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("Story App", {
            body: `${count} cerita berhasil disinkronkan`,
            icon: "/favicon.png",
          });
        }
      });
    }
  },
  // Tambahkan fungsi ini di dalam objek NetworkStatus
  _showToastNotification(message) {
    // Buat elemen toast
    const toast = document.createElement("div");
    toast.className = "toast-notification";
    toast.textContent = message;

    // Tambahkan ke body
    document.body.appendChild(toast);

    // Tampilkan dengan animasi
    setTimeout(() => {
      toast.classList.add("show");
    }, 100);

    // Sembunyikan setelah beberapa detik
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  },
};

export default NetworkStatus;
