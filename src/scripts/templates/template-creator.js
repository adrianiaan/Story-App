export const createStoryItemTemplate = (story) => `
  <div class="story-item">
    <div class="story-item__header">
      <img class="story-item__header__photo" src="${story.photoUrl}" alt="Foto dari ${story.name}" crossorigin="anonymous">
    </div>
    <div class="story-item__content">
      <h3 class="story-item__title"><a href="#/detail/${story.id}">${story.name}</a></h3>
      <p class="story-item__description">${story.description}</p>
      <p class="story-item__date">${new Date(story.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>
  </div>
`;

export const createStoryDetailTemplate = (story) => `
  <h2 class="story__title">${story.name}</h2>
  <img class="story__poster" src="${story.photoUrl}" alt="Foto dari ${story.name}" crossorigin="anonymous">
  <div class="story__info">
    <h3>Informasi</h3>
    <h4>Tanggal Dibuat</h4>
    <p>${new Date(story.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
    <h4>Deskripsi</h4>
    <p>${story.description}</p>
  </div>
`;

export const createLoginFormTemplate = () => `
  <div class="login-form">
    <h2>Masuk</h2>
    <form id="loginForm">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" required>
      </div>
      <div class="form-group">
        <button type="submit" class="btn btn-primary">Masuk</button>
      </div>
    </form>
    <p>Belum punya akun? <a href="#/register">Daftar di sini</a></p>
  </div>
`;

export const createRegisterFormTemplate = () => `
  <div class="register-form">
    <h2>Daftar</h2>
    <form id="registerForm">
      <div class="form-group">
        <label for="name">Nama</label>
        <input type="text" id="name" name="name" required>
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" required minlength="6">
      </div>
      <div class="form-group">
        <button type="submit" class="btn btn-primary">Daftar</button>
      </div>
    </form>
    <p>Sudah punya akun? <a href="#/login">Masuk di sini</a></p>
  </div>
`;