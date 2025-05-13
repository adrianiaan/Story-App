import { createAddStoryFormTemplate } from '../../templates/template-creator';
import { initMapForAddStory } from '../../utils/map-initializer';

class AddStoryView {
  constructor() {
    this._map = null;
    this._marker = null;
    this._stream = null;
    this._photoBlob = null;
    
    // Form elements
    this._addStoryForm = null;
    this._descriptionInput = null;
    this._photoInput = null;
    this._cameraPreview = null;
    this._photoCanvas = null;
    this._startCameraButton = null;
    this._capturePhotoButton = null;
    this._retakePhotoButton = null;
    this._photoPreview = null;
  }

  getTemplate() {
    return `
      <div class="content container">
        ${createAddStoryFormTemplate()}
      </div>
    `;
  }

  initElements() {
    // Initialize form elements
    this._addStoryForm = document.getElementById('addStoryForm');
    this._descriptionInput = document.getElementById('description');
    this._photoInput = document.getElementById('photo');
    this._cameraPreview = document.getElementById('cameraPreview');
    this._photoCanvas = document.getElementById('photoCanvas');
    this._startCameraButton = document.getElementById('startCamera');
    this._capturePhotoButton = document.getElementById('capturePhoto');
    this._retakePhotoButton = document.getElementById('retakePhoto');
    this._photoPreview = document.getElementById('photoPreview');
    
    // Initialize map
    const { map, marker } = initMapForAddStory('addStoryMap');
    this._map = map;
    this._marker = marker;
  }

  setupCameraFunctionality() {
    this._startCameraButton.addEventListener('click', async () => {
      try {
        this._stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
        
        this._cameraPreview.srcObject = this._stream;
        this._cameraPreview.style.display = 'block';
        this._startCameraButton.disabled = true;
        this._capturePhotoButton.disabled = false;
      } catch (error) {
        this.showErrorMessage('Tidak dapat mengakses kamera: ' + error.message);
      }
    });
    
    this._capturePhotoButton.addEventListener('click', () => {
      const context = this._photoCanvas.getContext('2d');
      this._photoCanvas.width = this._cameraPreview.videoWidth;
      this._photoCanvas.height = this._cameraPreview.videoHeight;
      
      context.drawImage(this._cameraPreview, 0, 0, this._photoCanvas.width, this._photoCanvas.height);
      
      this._photoCanvas.toBlob((blob) => {
        this._photoBlob = blob;
        
        const photoURL = URL.createObjectURL(blob);
        this._photoPreview.innerHTML = `<img src="${photoURL}" alt="Preview foto">`;
        
        // Stop camera stream
        this.stopCameraStream();
        
        this._cameraPreview.style.display = 'none';
        this._capturePhotoButton.disabled = true;
        this._retakePhotoButton.style.display = 'inline-block';
        
        // Create a File object from the blob
        const photoFile = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
        
        // Create a new FileList object
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(photoFile);
        this._photoInput.files = dataTransfer.files;
      }, 'image/jpeg');
    });
    
    this._retakePhotoButton.addEventListener('click', () => {
      this._photoPreview.innerHTML = '';
      this._retakePhotoButton.style.display = 'none';
      this._startCameraButton.disabled = false;
      this._photoInput.value = '';
      this._photoBlob = null;
    });
    
    // Handle file input change
    this._photoInput.addEventListener('change', (event) => {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        const photoURL = URL.createObjectURL(file);
        this._photoPreview.innerHTML = `<img src="${photoURL}" alt="Preview foto">`;
      }
    });
  }

  stopCameraStream() {
    if (this._stream) {
      this._stream.getTracks().forEach(track => track.stop());
      this._stream = null;
    }
  }

  setupFormSubmission(submitCallback) {
    this._addStoryForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const description = this._descriptionInput.value;
      const photoFile = this._photoInput.files[0] || this._photoBlob;
      const position = this._marker.getLatLng();
      
      if (!description || !photoFile) {
        this.showErrorMessage('Deskripsi dan foto harus diisi');
        return;
      }
      
      const formData = new FormData();
      formData.append('description', description);
      formData.append('photo', photoFile);
      
      // Tambahkan lokasi jika ada
      if (position) {
        formData.append('lat', position.lat);
        formData.append('lon', position.lng);
      }
      
      submitCallback(formData);
    });
  }

  showErrorMessage(message) {
    alert(message);
  }

  showSuccessMessage(message) {
    alert(message);
  }

  cleanUp() {
    // Penting: Hentikan stream kamera saat berpindah halaman
    this.stopCameraStream();
  }
}

export default AddStoryView;