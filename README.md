**File: d:\Dicoding\web Intermediate\Submission\Story-App\README.md**
```markdown
# Story App

Aplikasi berbagi cerita sederhana yang memungkinkan pengguna untuk membuat, membagikan, dan menikmati cerita dengan foto dan lokasi. Dibangun dengan JavaScript vanilla dan berbagai Web API modern.

## Table of Contents

- [Fitur](#fitur)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Teknologi](#teknologi)
- [Fitur Aksesibilitas](#fitur-aksesibilitas)

## Fitur

- Autentikasi pengguna (login dan registrasi)
- Membuat dan membagikan cerita dengan foto
- Mengambil foto langsung dari kamera perangkat
- Menambahkan lokasi pada cerita menggunakan peta interaktif
- Multiple layer maps (OpenStreetMap, Satelit, Terrain)
- Transisi halaman mulus dengan View Transition API
- Tampilan responsif untuk berbagai ukuran perangkat

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (disarankan versi 14 atau lebih tinggi)
- [npm](https://www.npmjs.com/) (Node package manager)

### Installation

1. Clone repositori ini.
   ```shell
   git clone https://github.com/username/Story-App.git
   ```
2. Masuk ke direktori proyek.
   ```shell
   cd Story-App
   ```
3. Pasang seluruh dependencies dengan perintah berikut.
   ```shell
   npm install
   ```

## Scripts

- Build for Production:
  ```shell
  npm run build
  ```
  Script ini menjalankan webpack dalam mode production menggunakan konfigurasi `webpack.prod.js` dan menghasilkan sejumlah file build ke direktori `dist`.

- Start Development Server:
  ```shell
  npm run start-dev
  ```
  Script ini menjalankan server pengembangan webpack dengan fitur live reload dan mode development sesuai konfigurasi di`webpack.dev.js`.

- Serve:
  ```shell
  npm run serve
  ```
  Script ini menggunakan [`http-server`](https://www.npmjs.com/package/http-server) untuk menyajikan konten dari direktori `dist`.

## Project Structure

```text
Story-App/
├── src/                    # Source project files
│   ├── public/             # Public files
│   │   ├── images/         # Image assets
│   │   └── favicon.png     # Favicon
│   ├── scripts/            # Source JavaScript files
│   │   ├── data/           # Data layer and API services
│   │   │   └── api.js      # API service
│   │   ├── pages/          # Page components
│   │   │   ├── about/      # About page
│   │   │   │   └── about-page.js
│   │   │   ├── add/        # Add story page
│   │   │   │   └── add-page.js
│   │   │   ├── auth/       # Authentication pages
│   │   │   ├── detail/     # Story detail page
│   │   │   │   └── detail-page.js
│   │   │   ├── home/       # Home page
│   │   │   └── app.js      # Main app component
│   │   ├── routes/         # Routing configuration
│   │   │   ├── routes.js   # Routes definition
│   │   │   └── url-parser.js # URL parsing utility
│   │   ├── templates/      # HTML templates
│   │   │   └── template-creator.js # Template functions
│   │   └── utils/          # Utility functions
│   │       ├── auth-utils.js # Authentication utilities
│   │       └── map-initializer.js # Map initialization
│   ├── styles/             # Source CSS files
│   │   └── styles.css      # Main CSS file
│   └── index.html          # Main HTML file
├── package.json            # Project metadata and dependencies
├── package-lock.json       # Project metadata and dependencies
├── README.md               # Project documentation
├── webpack.common.js       # Webpack common configuration
├── webpack.dev.js          # Webpack development configuration
└── webpack.prod.js         # Webpack production configuration
```

## Teknologi

- **Vanilla JavaScript**: Tanpa framework JavaScript
- **Webpack**: Sebagai module bundler
- **Babel**: Untuk transpile JavaScript
- **Leaflet.js**: Untuk menampilkan dan berinteraksi dengan peta
- **Web API**: Memanfaatkan Camera API, Geolocation API, dan View Transition API
- **CSS3**: Styling modern dengan fitur responsif
- **HTML5**: Markup semantik untuk aksesibilitas yang lebih baik

## Fitur Aksesibilitas

- Skip to content untuk navigasi keyboard
- Teks alternatif pada gambar
- Label yang berasosiasi dengan elemen input
- Struktur HTML semantik
- Desain responsif untuk berbagai perangkat
- Kontras warna yang memadai untuk keterbacaan
```