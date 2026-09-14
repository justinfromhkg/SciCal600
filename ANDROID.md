# SciCal600 for Android / Android 版

App ID: `io.github.justinfromhkg.scical600`. App name: **SciCal600**.
Android 6+ with an up-to-date Android System WebView. Node 22, JDK 21 and Android SDK are used by CI.

## Download / 下载

[Latest signed Release APK / 最新正式版](https://github.com/justinfromhkg/SciCal600/releases/latest/download/SciCal600-Android.apk)

Until the first signed release exists, this link will return 404. For development builds, open [Android APK Actions](https://github.com/justinfromhkg/SciCal600/actions/workflows/android.yml), select a successful run and download **SciCal600-debug**. Extract the ZIP and install **SciCal600-debug.apk**.
首次正式签名发布前，上方正式版链接会返回 404；请在成功的 Actions 运行中下载 debug artifact，解压后安装 APK。Android 可能要求允许此次下载来源安装应用。

## Cloud build / 云端构建

Every branch push / PR builds a debug APK and runs the existing tests, Web build, browser regression tests, Gradle lint, signature/package checks and an Android 15 emulator install/offline-launch check.
每次分支提交或 PR 都在云端执行；不需要用户电脑或 Android Studio。Actions artifact 保留 90 天。

```sh
npm install
npm test
npm run build
npx playwright install chromium
npm run test:browser
npm run android:debug
```

Output: `android/app/build/outputs/apk/debug/app-debug.apk`.
`native/android/` contains maintained native overrides. `npm run android:sync` generates the Android project from the pinned Capacitor template, applies overrides and copies the local Web bundle. The generated `android/` directory is disposable; edit overrides, not generated files.
原生修改维护在 `native/android/`；生成目录可重建。Web 版本仍使用原来的静态构建。Android 使用本地资源及系统后备字体，计算不需要网络。

Back closes a dialog or LCD menu first, then navigates backward, returns home or minimizes the app. Native window insets keep controls clear of system bars, display cutouts and keyboard. Rotation is supported by the existing responsive layout.
返回键依次处理弹窗、LCD 菜单、历史页面、首页和最小化。原生 insets 处理系统栏、刘海和键盘；沿用响应式布局支持旋转。

## Signed releases / 正式签名

Configure the **android-release** GitHub Environment with these secrets:
- `ANDROID_KEYSTORE_BASE64`: Base64 of the owner's existing production keystore / 正式 keystore 的 Base64。
- `ANDROID_KEYSTORE_PASSWORD`: keystore password。
- `ANDROID_KEY_ALIAS`: signing key alias。
- `ANDROID_KEY_PASSWORD`: key password。

Keep a secure backup of the same production key for future updates. Never commit it. This repository does not generate production keys or fall back to debug signing for releases.
请保管同一正式密钥供后续更新使用；不会生成临时生产密钥，也不会把 debug 签名冒充正式签名。

After merging, push a version tag such as `v0.3.1`. The release job uses SDK zipalign/apksigner and publishes **SciCal600-Android.apk** plus **SHA256SUMS**. Missing secrets fail the release job without publishing. Configure Environment protection as appropriate.
合并后推送版本标签即可发布。缺少 secrets 会使正式发布失败，不会上传未签名 APK。debug APK 使用标准开发签名；不同 runner 的开发密钥可能不同，不能保证覆盖安装，卸载会清除本地数据。

## Verification / 验证

CI records signature verification, package identity, file size and SHA-256 in the artifact and logs. The emulator check verifies installation and offline process launch; it is not a substitute for testing every UI interaction on physical devices.
CI 输出签名、包名、大小、SHA-256，并实际安装和离线启动；该检查不代表已覆盖所有真机交互。
