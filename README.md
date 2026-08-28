# Sovereign Launchpad — Production PWA & Android Application

Premium web development agency and sovereign client launchpad. Custom engineered websites built for conversion and growth.

This project is configured as a production-ready Progressive Web App (PWA) and a native Capacitor Android application, designed for fully automated continuous integration (CI) and signing using Codemagic.

---

## 🚀 PWA & Mobile Quality Features

* **Complete PWA Support**: Manifest specifications configured with responsive standard & maskable icons, custom standalone display, theme color matching, and orientation settings.
* **Service Worker Caching**: Production service worker (`public/sw.js`) that caches static pages and assets, handles offline navigation elegantly via a branded offline error page (`/offline`), and supports automated background updates.
* **Adaptive App Icons**: Custom Android launcher icons resized across standard screen density buckets (`mdpi`, `hdpi`, `xhdpi`, `xxhdpi`, `xxxhdpi`) matching the original high-resolution logo.
* **Secure Environment Variables**: Direct runtime binding of Supabase secrets to protect credentials and support dynamic compilation both on the server (e.g. Render) and mobile device shells.

---

## 🛠️ Local Development & Installation

### 1. Install Dependencies
Ensure you are using the latest stable Node.js LTS and run:
```bash
npm install
```

### 2. Environment Variables Configuration
Create a `.env.local` file in the root directory and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application with live hot-reloading.

---

## 📦 Web Production Build

Build the production-ready optimized web bundle:
```bash
npm run build
```
This script will verify typescript declarations, run ESLint rules, compile static pages, and package the Next.js production build successfully.

---

## 📱 Capacitor Mobile Shell (Android)

Sovereign Launchpad uses Capacitor to wrap the Next.js production build into a native Android application.

### 1. Web Assets Synchronization
Sync your current web build configuration and assets with the Android native folder:
```bash
npm run cap:sync
```

### 2. Run / Open in Android Studio
Open the project inside Android Studio to run it on physical devices or emulators:
```bash
npm run cap:open
```

### 3. Compile Local Debug APK
You can compile a local test APK immediately using:
```bash
npm run android:build:debug
```

---

## 🌐 Codemagic CI/CD Automated Workflow

The repository includes a complete `codemagic.yaml` script. It automatically triggers on commits, checks out the codebase, restores build caches, builds the Next.js bundle, updates native assets, and compiles a signed Android App Bundle (`.aab`) ready for Google Play Store upload.

### Environment Variables required in Codemagic:

Set these inside your Codemagic application dashboard:
1. **`SUPABASE_URL`**: Your production Supabase Endpoint.
2. **`SUPABASE_ANON_KEY`**: Your production Supabase Anon Key.
3. **`CM_KEYSTORE_PASSWORD`**: Password of your upload keystore.
4. **`CM_KEY_ALIAS`**: Key alias name in your keystore.
5. **`CM_KEY_PASSWORD`**: Key password in your keystore.
6. **`CM_KEYSTORE`** *(Optional)*: Base64-encoded string of your keystore file. If you prefer, you can upload the binary keystore file directly as a secure file in the next step instead.

### Keystore Upload Guide:
1. Log into your **Codemagic Dashboard** and select the **Sovereign Launchpad** project.
2. Navigate to the **Environment variables** tab or the **Secure files** section.
3. Upload your standard **`upload-keystore.jks`** keystore file.
4. Our `codemagic.yaml` build script automatically scans, locates, and links any uploaded `.jks` file, configuring Gradle to sign the final release without requiring any hardcoded secrets in the code!

### Triggering a Release Build:
To build your signed `.aab` production bundle:
```bash
npm run android:build:release
```
Or simply commit and push your changes to your repository! Codemagic will pick up the push, compile the code, sign it, and email the resulting bundle to `aaryaveersharma16@gmail.com` on successful completion!

---

## 🔧 Troubleshooting Steps

* **EADDRINUSE (Port in use) error**: Run `fuser -k 3000/tcp` (or whichever port is stuck) to kill hanging processes, then run `npm run dev` again.
* **Database Connection fails (fetch failed)**: Double-check your `.env` or Render environment variables for leading/trailing whitespaces or missing `https://` prefixes. Our lazy client initializers trim and auto-prefix protocol strings, but verification in your dashboard ensures maximum reliability.
* **Gradle Build version conflicts**: Gradle configuration resides in the `android/` directory and is set to match compile and target SDKs dynamically. Ensure your Java compiler version matches Java 17 or higher (recommended).
