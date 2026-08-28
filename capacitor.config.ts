import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "in.sovereignsites.launchpad",
  appName: "Sovereign Launchpad",
  webDir: "out",
  server: {
    url: "https://book.sovereignsites.in",
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#060606",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
    },
    StatusBar: {
      backgroundColor: "#060606",
      style: "DARK",
    },
  },
};

export default config;
