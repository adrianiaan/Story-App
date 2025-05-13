import AuthUtils from '../../utils/auth-utils';
import StoryApiService from '../../data/api';
import { initMapForAddStory } from '../../utils/map-initializer';
import { createAddStoryFormTemplate } from '../../templates/template-creator';

export default class AddPage {
  constructor() {
    this.stream = null;
    this.photoBlob = null;
  }

  async render() {
    return `
      <div class="content container">
        ${createAddStoryFormTemplate()}
      </div>
    `;
  }

  async afterRender() {
    const { token } = AuthUtils.getAuth();
    
    if (!token) {
      window.location.href = '#/login';
      return;
    }
    
    // Initialize map
    const mapElement = document.getElementById('addStoryMap');
    const { map, marker } = initMapForAddStory('addStoryMap');
    
    // Camera functionality
    const cameraPreview = document.getElementById('cameraPreview');
    const photoCanvas = document.getElementById('photoCanvas');
    const startCameraButton = document.getElementById('startCamera');
    const capturePhotoButton = document.getElementById('capturePhoto');
    const retakePhotoButton = document.getElementById('retakePhoto');
    const photoPreview = document.getElementById('photoPreview');
    const photoInput = document.getElementById('photo');
    
    // Pastikan stream kamera berhenti ketika pengguna berpindah halaman
    this._setupCameraCleanup();
    
    startCameraButton.addEventListener('click', async () => {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
        
        cameraPreview.srcObject = this.stream;
        cameraPreview.style.display = 'block';
        startCameraButton.disabled = true;
        capturePhotoButton.disabled = false;
      } catch (error) {
        alert('Tidak dapat mengakses kamera: ' + error.message);
      }
    });
    
    capturePhotoButton.addEventListener('click', () => {
      const context = photoCanvas.getContext('2d');
      photoCanvas.width = cameraPreview.videoWidth;
      photoCanvas.height = cameraPreview.videoHeight;
      
      context.drawImage(cameraPreview, 0, 0, photoCanvas.width, photoCanvas.height);
      
      photoCanvas.toBlob((blob) => {
        this.photoBlob = blob;
        
        const photoURL = URL.createObjectURL(blob);
        photoPreview.innerHTML = `<img src="${photoURL}" alt="Preview foto">`;
        
        // Stop camera stream
        this._stopCameraStream();
        
        cameraPreview.style.display = 'none';
        capturePhotoButton.disabled = true;
        retakePhotoButton.style.display = 'inline-block';
        
        // Create a File object from the blob
        const photoFile = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
        
        // Create a new FileList object
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(photoFile);
        photoInput.files = dataTransfer.files;
      }, 'image/jpeg');
    });
    
    retakePhotoButton.addEventListener('click', () => {
      photoPreview.innerHTML = '';
      retakePhotoButton.style.display = 'none';
      startCameraButton.disabled = false;
      photoInput.value = '';
      this.photoBlob = null;
    });
    
    // Handle file input change
    photoInput.addEventListener('change', (event) => {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        const photoURL = URL.createObjectURL(file);
        photoPreview.innerHTML = `<img src="${photoURL}" alt="Preview foto">`;
      }
    });
    
    // Form submission
    const addStoryForm = document.getElementById('addStoryForm');
    
    addStoryForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const description = document.getElementById('description').value;
      const photoFile = photoInput.files[0] || this.photoBlob;
      const position = marker.getLatLng();
      
      if (!description || !photoFile) {
        alert('Deskripsi dan foto harus diisi');
        return;
      }
      
      try {
        const formData = new FormData();
        formData.append('description', description);
        formData.append('photo', photoFile);
        
        // Tambahkan lokasi jika ada
        if (position) {
          formData.append('lat', position.lat);
          formData.append('lon', position.lng);
        }
        
        const response = await StoryApiService.addStory(formData, token);
        
        if (!response.error) {
          alert('Cerita berhasil ditambahkan');
          window.location.href = '#/';
        } else {
          alert(`Gagal menambahkan cerita: ${response.message}`);
        }
      } catch (error) {
        alert('Terjadi kesalahan saat menambahkan cerita');
        console.error(error);
      }
    });
  }

  // Metode untuk menghentikan stream kamera
  _stopCameraStream() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  // Metode untuk memastikan stream kamera berhenti ketika pengguna berpindah halaman
  _setupCameraCleanup() {
    // Tambahkan event listener untuk hashchange
    const hashChangeHandler = () => {
      this._stopCameraStream();
    };
    
    window.addEventListener('hashchange', hashChangeHandler);
    
    // Tambahkan event listener untuk beforeunload
    const beforeUnloadHandler = () => {
      this._stopCameraStream();
    };
    
    window.addEventListener('beforeunload', beforeUnloadHandler);
    
    // Tambahkan event listener untuk visibilitychange
    const visibilityChangeHandler = () => {
      if (document.hidden) {
        this._stopCameraStream();
      }
    };
    
    document.addEventListener('visibilitychange', visibilityChangeHandler);
  }
}