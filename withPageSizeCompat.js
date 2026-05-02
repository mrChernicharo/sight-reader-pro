const {
  withAndroidManifest,
  withProjectBuildGradle,
} = require('@expo/config-plugins');

/** Oboe 1.10.0 is first Maven release with 16 KB–aligned prebuilts (see google/oboe#2126). react-native-audio-api pins 1.9.3. */
const OBOE_VERSION = '1.10.0';

/**
 * Google Play: 16 KB memory page size compliance for native (.so) libraries.
 *
 * - JNI packaging: `expo-build-properties` → `useLegacyPackaging: false`.
 * - liboboe.so: force `com.google.oboe:oboe` to 1.10.0+ (Gradle resolution); 1.9.x AARs are not 16 KB–aligned.
 * - Do not use `android.buildFromSource` here — Hermes-from-source needs `sdkmanager` on the build machine (breaks many EAS local builds).
 */
module.exports = function withPageSizeCompat(config) {
  config = withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    const application = androidManifest.manifest.application[0];

    delete application.$['android:pageSizeCompat'];

    application.$['android:extractNativeLibs'] = 'true';

    return config;
  });

  config = withProjectBuildGradle(config, (config) => {
    let contents = config.modResults.contents;
    const marker = '// [withPageSizeCompat] Oboe';

    if (!contents.includes(marker)) {
      contents += `

${marker} ${OBOE_VERSION} — Play 16 KB–aligned liboboe.so (override react-native-audio-api’s 1.9.3).
subprojects { subproject ->
  subproject.configurations.configureEach { configuration ->
    configuration.resolutionStrategy.eachDependency { details ->
      if (details.requested.group == "com.google.oboe" && details.requested.name == "oboe") {
        details.useVersion("${OBOE_VERSION}")
      }
    }
  }
}
`;
    }

    config.modResults.contents = contents;
    return config;
  });

  return config;
};
