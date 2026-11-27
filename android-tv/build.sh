#!/usr/bin/env bash
# Run from the repository root after npm ci. Outputs an unsigned, aligned HML APK.
set -euo pipefail
sdk=${ANDROID_HOME:?Configure ANDROID_HOME}
tools="$sdk/build-tools/35.0.0"
platform="$sdk/platforms/android-35/android.jar"
dest=${1:-dist/android-tv-unsigned.apk}
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT
mkdir -p "$work/classes" "$work/dex" "$(dirname "$dest")"
node android-tv/bundle.mjs "$work/assets"
sources=(android-tv/src/br/com/vitrineiapro/indoor/hml/*.java)
if [[ -n "${ECJ_JAR:-}" ]]; then
  java -jar "$ECJ_JAR" -source 1.8 -target 1.8 -bootclasspath "$platform" -d "$work/classes" "${sources[@]}"
else
  javac -source 8 -target 8 -bootclasspath "$platform" -d "$work/classes" "${sources[@]}"
fi
"$tools/d8" --min-api 23 --lib "$platform" --output "$work/dex" "$work/classes/br/com/vitrineiapro/indoor/hml/"*.class
"$tools/aapt2" compile --dir android-tv/res -o "$work/resources.zip"
"$tools/aapt2" link -I "$platform" --manifest android-tv/AndroidManifest.xml -A "$work/assets" -0 mp4 -o "$work/player.apk" "$work/resources.zip"
(cd "$work/dex" && zip -q -0 "$work/player.apk" classes.dex)
"$tools/zipalign" -f 4 "$work/player.apk" "$dest"
