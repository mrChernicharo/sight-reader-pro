const { withAndroidManifest } = require('@expo/config-plugins');

/**
 * Config plugin to ensure 16KB page size compliance.
 *
 * We use extractNativeLibs="true" combined with compressed libraries
 * to ensure the OS handles 16KB alignment at install time.
 */
module.exports = function withPageSizeCompat(config) {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    const application = androidManifest.manifest.application[0];

    // Remove the failing attribute to fix the build error
    delete application.$['android:pageSizeCompat'];

    // Force extraction so the OS can align libraries correctly on 16KB devices
    application.$['android:extractNativeLibs'] = 'true';

    return config;
  });
};
