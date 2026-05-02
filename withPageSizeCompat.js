const { withAndroidManifest } = require('@expo/config-plugins');

/**
 * Config plugin to ensure 16KB page size compliance.
 *
 * Note: We removed the 'android:pageSizeCompat' attribute because it was causing
 * AAPT resource linking errors in some build environments.
 *
 * Compliance is achieved by:
 * 1. Using NDK r28 (handled in app.json) for 16KB ELF alignment.
 * 2. Setting extractNativeLibs="false" for uncompressed, aligned libraries.
 */
module.exports = function withPageSizeCompat(config) {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    const application = androidManifest.manifest.application[0];

    // Set to "false" to ensure libraries stay uncompressed in the APK.
    // This requires AGP 8.5.1+ to handle the 16KB zip alignment.
    application.$['android:extractNativeLibs'] = 'false';

    return config;
  });
};
