const NetworkStatus = {
  init({ connectionStatusElement }) {
    this._connectionStatusElement = connectionStatusElement;
    this._initNetworkStatus();
  },

  _initNetworkStatus() {
    window.addEventListener('online', () => {
      this._updateNetworkStatus(true);
    });

    window.addEventListener('offline', () => {
      this._updateNetworkStatus(false);
    });

    // Cek status awal
    this._updateNetworkStatus(navigator.onLine);
  },

  _updateNetworkStatus(isOnline) {
    if (!this._connectionStatusElement) return;

    if (isOnline) {
      this._connectionStatusElement.textContent = 'Online';
      this._connectionStatusElement.classList.remove('offline');
      this._connectionStatusElement.classList.add('online');
      
      // Sembunyikan setelah beberapa detik
      setTimeout(() => {
        this._connectionStatusElement.classList.add('hidden');
      }, 3000);
    } else {
      this._connectionStatusElement.textContent = 'Offline - Beberapa fitur mungkin tidak tersedia';
      this._connectionStatusElement.classList.remove('online', 'hidden');
      this._connectionStatusElement.classList.add('offline');
    }
  }
};

export default NetworkStatus;