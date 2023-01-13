## [0.7.0](https://github.com/stonith404/pingvin-share/compare/v0.6.1...v0.7.0) (2023-01-13)


### Features

* add ClamAV to scan for malicious files ([76088cc](https://github.com/stonith404/pingvin-share/commit/76088cc76aedae709f06deaee2244efcf6a22bed))


### Bug Fixes

* invalid github release link on admin page ([349bf47](https://github.com/stonith404/pingvin-share/commit/349bf475cc7fc1141dbd2a9bd2f63153c4d5b41b))

### [0.6.1](https://github.com/stonith404/pingvin-share/compare/v0.6.0...v0.6.1) (2023-01-11)


### Features

* delete all sessions if password was changed ([02e41e2](https://github.com/stonith404/pingvin-share/commit/02e41e243768de34de1bdc8833e83f60db530e55))


### Bug Fixes

* shareUrl uses wrong origin ([f1b44f8](https://github.com/stonith404/pingvin-share/commit/f1b44f87fa64d3b21ca92c9068cb352d0ad51bc0))
* update password doesn't work ([74e8956](https://github.com/stonith404/pingvin-share/commit/74e895610642552c98c0015d0f8347735aaed457))

## [0.6.0](https://github.com/stonith404/pingvin-share/compare/v0.5.1...v0.6.0) (2023-01-09)


### Features

* chunk uploads ([#76](https://github.com/stonith404/pingvin-share/issues/76)) ([653d72b](https://github.com/stonith404/pingvin-share/commit/653d72bcb958268e2f23efae94cccb72faa745af))


### Bug Fixes

* access token refreshes even it is still valid ([c8ad222](https://github.com/stonith404/pingvin-share/commit/c8ad2225e3c9ca79fea494d538b67797fbc7f6ae))
* error message typo ([72c8081](https://github.com/stonith404/pingvin-share/commit/72c8081e7c135ab1f600ed7e3d7a0bf03dabde34))
* migration for v0.5.1 ([f2d4895](https://github.com/stonith404/pingvin-share/commit/f2d4895e50d3da82cef68858752fb7f6293e7a20))
* refresh token expires after 1 day instead of 3 months ([a5bef5d](https://github.com/stonith404/pingvin-share/commit/a5bef5d4a4ae75447ca1f65259c5541edfc87dd8))

### [0.5.1](https://github.com/stonith404/pingvin-share/compare/v0.5.0...v0.5.1) (2023-01-04)


### Features

* show version and show button if new release is available on admin page ([71658ad](https://github.com/stonith404/pingvin-share/commit/71658ad39d7e3638de659e8230fad4e05f60fdd8))
* use cookies for authentication ([faea1ab](https://github.com/stonith404/pingvin-share/commit/faea1abcc4b533f391feaed427e211fef9166fe4))


### Bug Fixes

* email configuration updated without restart ([1117465](https://github.com/stonith404/pingvin-share/commit/11174656e425c4be60e4f7b1ea8463678e5c60d2))

## [0.5.0](https://github.com/stonith404/pingvin-share/compare/v0.4.0...v0.5.0) (2022-12-30)


### Features

* custom mail subject ([cabaee5](https://github.com/stonith404/pingvin-share/commit/cabaee588b50877872d210c870bfb9c95b541921))
* improve config UI ([#69](https://github.com/stonith404/pingvin-share/issues/69)) ([5bc4f90](https://github.com/stonith404/pingvin-share/commit/5bc4f902f6218a09423491404806a4b7fb865c98))
* manually switch color scheme ([ef21bac](https://github.com/stonith404/pingvin-share/commit/ef21bac59b11dc68649ab3b195dcb89d2b192e7b))


### Bug Fixes

* refresh token gets deleted on session end ([e5b50f8](https://github.com/stonith404/pingvin-share/commit/e5b50f855c02aa4b5c9ee873dd5a7ab25759972d))

## [0.4.0](https://github.com/stonith404/pingvin-share/compare/v0.3.6...v0.4.0) (2022-12-21)


### Features

* custom email message ([0616a68](https://github.com/stonith404/pingvin-share/commit/0616a68bd2e0c9cb559ebdf294e353dd3f69c9a5))
* TOTP (two-factor) Authentication ([#55](https://github.com/stonith404/pingvin-share/issues/55)) ([16480f6](https://github.com/stonith404/pingvin-share/commit/16480f6e9572011fadeb981a388b92cb646fa6d9))

### [0.3.6](https://github.com/stonith404/pingvin-share/compare/v0.3.5...v0.3.6) (2022-12-13)


### Features

* add description field to share ([8728fa5](https://github.com/stonith404/pingvin-share/commit/8728fa5207524e9aee26d68eafe1b6fff367d749))


### Bug Fixes

* remove dot in email link ([9b0c08d](https://github.com/stonith404/pingvin-share/commit/9b0c08d0cdeeeef217ccba57f593fea9d8858371))
* rerange accordion items ([844c47e](https://github.com/stonith404/pingvin-share/commit/844c47e1290fb0f7dedb41a18be59ed5ab83dabc))

### [0.3.5](https://github.com/stonith404/pingvin-share/compare/v0.3.4...v0.3.5) (2022-12-11)


### Features

* upload 3 files at same time ([d010a8a](https://github.com/stonith404/pingvin-share/commit/d010a8a2d366708b1bb5088e9c1e9f9378d3e023))


### Bug Fixes

* jobs never get executed ([05cbb7b](https://github.com/stonith404/pingvin-share/commit/05cbb7b27ef98a3a80dd9edc318f1dcc9a8bd442))
* only create zip if more than one file is in the share ([3d1d4d0](https://github.com/stonith404/pingvin-share/commit/3d1d4d0fc7c0351724387c3721280c334ae94d98))
* remove unnecessary port expose ([084e911](https://github.com/stonith404/pingvin-share/commit/084e911eed95eb22fea0bf185803ba32c3eda1a9))
* setup wizard table doesn't take full width ([9798e26](https://github.com/stonith404/pingvin-share/commit/9798e26872064edc1049138cf73479b1354a43ed))
* use node slim to fix arm builds ([797f893](https://github.com/stonith404/pingvin-share/commit/797f8938cac9cc3bb788f632d97eba5c49fe98a5))
* zip doesn't contain file extension ([5b01108](https://github.com/stonith404/pingvin-share/commit/5b0110877745f1fcde4952737a93c07ef4a2a92d))

### [0.3.4](https://github.com/stonith404/pingvin-share/compare/v0.3.3...v0.3.4) (2022-12-10)


### Bug Fixes

* show alternative to copy button if site is not using https ([7e877ce](https://github.com/stonith404/pingvin-share/commit/7e877ce9f4b82d61c9b238e17def9f4c29e7aeb8))
* sign up page available when registration is disabled ([c8a4521](https://github.com/stonith404/pingvin-share/commit/c8a4521677280d6aba89d293a1fe0c38adf9f92c))
* tables on mobile ([b1bfb09](https://github.com/stonith404/pingvin-share/commit/b1bfb09dfd5c90cc18847470a9ce1ce8397c1476))

### [0.3.3](https://github.com/stonith404/pingvin-share/compare/v0.3.2...v0.3.3) (2022-12-08)


### Features

* add support for different email and user ([888a0c5](https://github.com/stonith404/pingvin-share/commit/888a0c5fafc51b6872ed71e37d4b40c9bf6a07f1))


### Bug Fixes

* allow empty strings in config variable ([b8172ef](https://github.com/stonith404/pingvin-share/commit/b8172efd59fb3271ab9b818b13a7003342b2cebd))
* improve admin dashboard color and layout ([a545c44](https://github.com/stonith404/pingvin-share/commit/a545c444261c90105dcb165ebcf4b26634e729ca))
* obscure critical config variables ([bfb0d15](https://github.com/stonith404/pingvin-share/commit/bfb0d151ea2ba125e536a16b1873e143a67e9f64))
* obscured text length ([cbe37c6](https://github.com/stonith404/pingvin-share/commit/cbe37c679853ecef1522ed213e4cac5defd5b45a))
* space character in email ([907e56a](https://github.com/stonith404/pingvin-share/commit/907e56af0faccdbc8d7f5ab3418a4ad71ff849f5))

### [0.3.2](https://github.com/stonith404/pingvin-share/compare/v0.3.1...v0.3.2) (2022-12-07)


### Bug Fixes

* make share password optional ([57cb683](https://github.com/stonith404/pingvin-share/commit/57cb683c64eaedec2697ea6863948bd2ae68dd75))
* unauthenticated dialog not shown ([4a016ed](https://github.com/stonith404/pingvin-share/commit/4a016ed57db526ee900c567f7b7f0991f948c631))
* use session storage for share token ([5ea63fb](https://github.com/stonith404/pingvin-share/commit/5ea63fb60be0c508c38ba228cc8ac6dd7b403aac))

### [0.3.1](https://github.com/stonith404/pingvin-share/compare/v0.3.0...v0.3.1) (2022-12-05)


### Bug Fixes

* dropzone rejection on chrome ([75f57a4](https://github.com/stonith404/pingvin-share/commit/75f57a4e57fb13cc62e87428e8302b453ea6b44b))

## [0.3.0](https://github.com/stonith404/pingvin-share/compare/v0.2.0...v0.3.0) (2022-12-05)


### Features

* add add new config strategy to frontend ([493705e](https://github.com/stonith404/pingvin-share/commit/493705e4ef21cb638620b0037b9ff2cec8046c95))
* add administrator guard ([13f98cc](https://github.com/stonith404/pingvin-share/commit/13f98cc32c804c786c71b10dc4cf029d7795be76))
* add job that deleted temporary files ([b649d8b](https://github.com/stonith404/pingvin-share/commit/b649d8bf8e849aff3f350e3c5fd0151a063b9706))
* add new config strategy to backend ([1b5e53f](https://github.com/stonith404/pingvin-share/commit/1b5e53ff7ee00228eda6dc5c62d5cd8c3752b03b))
* add setup wizard ([b579b8f](https://github.com/stonith404/pingvin-share/commit/b579b8f3309e2d7070e6a82c5da76ab8029bee11))
* add user management ([7a3967f](https://github.com/stonith404/pingvin-share/commit/7a3967fd6f76a03461d05e962e82fe5130528ca5))
* add user operations to backend ([31b3f6c](https://github.com/stonith404/pingvin-share/commit/31b3f6cb2fc662623df92cdbaf803f1b98a696ae))


### Bug Fixes

* convert async function to sync function ([1dbfe0b](https://github.com/stonith404/pingvin-share/commit/1dbfe0bbc9821bbee02220484c87cf9fe12fd033))
* database migration by adding a username ([e9526fc](https://github.com/stonith404/pingvin-share/commit/e9526fc0390cc8ba70c824370041ea9aaf6f9ef9))
* docker build ([e958a83](https://github.com/stonith404/pingvin-share/commit/e958a83b87a452e42fb38c12d4b11d71b2323c2d))
* share password validation ([c795b98](https://github.com/stonith404/pingvin-share/commit/c795b988df437c85efb91e0f6f8ec782f38dbe3d))
* unable to update user privileges ([d4a0f1a](https://github.com/stonith404/pingvin-share/commit/d4a0f1a4f16b7980fb244a4e582ceeb9bfaff877))

## [0.2.0](https://github.com/stonith404/pingvin-share/compare/v0.1.1...v0.2.0) (2022-11-13)


### Features

* add email recepients functionality ([32ad43a](https://github.com/stonith404/pingvin-share/commit/32ad43ae27a29b946bfba0040cac7eb158c84553))


### Bug Fixes

* add public userDTO to prevent confusion ([0efd2d8](https://github.com/stonith404/pingvin-share/commit/0efd2d8bf96506cf7d7dc2dc3164a8d59009cec7))
* email sending when not signed in ([32eaee4](https://github.com/stonith404/pingvin-share/commit/32eaee42363250defa92913c738a2702ba3e2693))
* hide and disallow email recipients if disabled ([34db3ae](https://github.com/stonith404/pingvin-share/commit/34db3ae2a997498edaa70404807d0e770dad6edb))

### [0.1.1](https://github.com/stonith404/pingvin-share/compare/v0.1.0...v0.1.1) (2022-10-31)


### Bug Fixes

* add `ALLOW_UNAUTHENTICATED_SHARES` to docker compose file ([599d8ca](https://github.com/stonith404/pingvin-share/commit/599d8caa31dc018c14c959d6602ac652eaef5da2))
* only log jobs if they actually did something ([e40cc0f](https://github.com/stonith404/pingvin-share/commit/e40cc0f48beec09e18738de1b445cabd9daab09b))
* share finishes before all files are uploaded ([99de4e5](https://github.com/stonith404/pingvin-share/commit/99de4e57e18df54596e168a57b94c55d7a834472))

## [0.1.0](https://github.com/stonith404/pingvin-share/compare/v0.0.1...v0.1.0) (2022-10-29)


### Features

* add rate limiting ([712cfe6](https://github.com/stonith404/pingvin-share/commit/712cfe625a19dc9790cda5fbc2843fed0836b860))
* allow unauthenticated uploads ([84d29df](https://github.com/stonith404/pingvin-share/commit/84d29dff68d0ea9d76d9a35f9fb7dff95d3dda1b))
* **frontend:** remove footer ([c52a4d5](https://github.com/stonith404/pingvin-share/commit/c52a4d5e3ad717a10d15b7fe1dbf359b041c0976))


### Bug Fixes

* infinite loading when file size is small ([c2ddce6](https://github.com/stonith404/pingvin-share/commit/c2ddce62038e561d292f23fc6089562e64f1ffe9))
* only show not signed in warning if not signed in ([c6e1f07](https://github.com/stonith404/pingvin-share/commit/c6e1f07f51e9cdd914bb70fb19dd81b90a470563))
* opt out of static site generation to enable `publicRuntimeConfig` ([239b18c](https://github.com/stonith404/pingvin-share/commit/239b18cdae6367322bcdacb6b2bbaa1028295cc4))
* visitor count doesn't get incremented ([c8021a4](https://github.com/stonith404/pingvin-share/commit/c8021a42b7fb094e587325bf855fc3133b6b96b0))

### [0.0.1](https://github.com/stonith404/pingvin-share/compare/4bab33ad8a79302fd94c6d92a3ddf87cdff8b214...v0.0.1) (2022-10-17)


### Features

* add `linux/arm/v7` arch for docker image ([d9e5c28](https://github.com/stonith404/pingvin-share/commit/d9e5c286e3b53834276511227f219d0858ca0829))
* add progress indicator for uploading files ([8c84d50](https://github.com/stonith404/pingvin-share/commit/8c84d50159bdabc75a1199ffdf372b9586f67371))
* Added "never" expiration date ([56349c6](https://github.com/stonith404/pingvin-share/commit/56349c6f4cc739d07bcf8ad862b0868e09342883))
* automatically detect hour format ([4e3f6be](https://github.com/stonith404/pingvin-share/commit/4e3f6be8e322929b83a35c7789078260dca9eb58))
* extract logo to component ([58efc48](https://github.com/stonith404/pingvin-share/commit/58efc48ffa559b4bfa03e381bccb552c8fb830b9))
* improve share security ([6358ac3](https://github.com/stonith404/pingvin-share/commit/6358ac3918d1af1cc05aca634d9d32a8f35d251f))
* put db and uploads in same folder ([80cdcda](https://github.com/stonith404/pingvin-share/commit/80cdcda93c385a8f5c1e22c7b84740f5d8119ef1))
* remove appwrite and add nextjs backend ([4bab33a](https://github.com/stonith404/pingvin-share/commit/4bab33ad8a79302fd94c6d92a3ddf87cdff8b214))
* remove postgres & use a single docker container ([388ac39](https://github.com/stonith404/pingvin-share/commit/388ac395ba85aae8a91ddfb5f5637a80a3e6f16b))
* replace tooltip with toast ([a33b5b3](https://github.com/stonith404/pingvin-share/commit/a33b5b37d92071e643a0bf78a9d6ecf29bebc65a))
* use system color theme ([d902aae](https://github.com/stonith404/pingvin-share/commit/d902aae03ff33d39c733cf1bce88ae58ff4cd888))


### Bug Fixes

* account dropdown on mobile ([caed1f4](https://github.com/stonith404/pingvin-share/commit/caed1f40ad2e32f241d0254652b42e19d8ec18d5))
* action docker file path ([e818a29](https://github.com/stonith404/pingvin-share/commit/e818a2944260dd3e773d6fdf187d21ebffb9c561))
* actions syntax error ([ce6568d](https://github.com/stonith404/pingvin-share/commit/ce6568d2b836965feb4250cec981bc75eb273fdd))
* add error handling for uploading ([e2b3e6a](https://github.com/stonith404/pingvin-share/commit/e2b3e6a1e86af95e1d9d20e7dd179c1a0ee6109f))
* add rule to check if user is owner of share ([2c47b2a](https://github.com/stonith404/pingvin-share/commit/2c47b2a28468dd6beaf88892aaa867ca579905ca))
* delete files when deleting share manually ([ffd538f](https://github.com/stonith404/pingvin-share/commit/ffd538f1408733ae3ba36bdd3a57995986fb0fad))
* delete share if user deleted ([b57092c](https://github.com/stonith404/pingvin-share/commit/b57092ce3ee1806922c9a1e1959d66d752b70067))
* dto returns ([02beb66](https://github.com/stonith404/pingvin-share/commit/02beb669107f022cf6bd6cf072cf499bbc92914c))
* error when refresh token is expired ([0823d28](https://github.com/stonith404/pingvin-share/commit/0823d28e230642e49553519e7883764637766773))
* file names with special characters ([bfbf3d8](https://github.com/stonith404/pingvin-share/commit/bfbf3d8130c07a4db4026cbf6a1fae78ca409fb8))
* get theme on inital load ([a40c2de](https://github.com/stonith404/pingvin-share/commit/a40c2ded823e391c95161feda3a5e8799ca9d2d1))
* improve failed upload error handling ([1259922](https://github.com/stonith404/pingvin-share/commit/1259922847170fe7deb480e117d90e0bf0b31b0a))
* my shares doesn't make an api request ([247ce92](https://github.com/stonith404/pingvin-share/commit/247ce92744b64beff2b7bb19c9ae3a3d1e724159))
* refresh token on visit after 15 minutes ([d153f20](https://github.com/stonith404/pingvin-share/commit/d153f202e6ea07982a098692817d377801f5adf3))
* remove build target linux/arm/v7 as prisma doesn't support it ([c16cbb3](https://github.com/stonith404/pingvin-share/commit/c16cbb3f42745bff3910433e68416b9f84faaff1))
* remove filetype from file list ([68ce8af](https://github.com/stonith404/pingvin-share/commit/68ce8af197598f7c4a729bab8081904f01002b6b))
* remove unused env variable ([cc17e7e](https://github.com/stonith404/pingvin-share/commit/cc17e7e641806b7fef2dbeb19e545e8e9177f769))
* security accerdion ([8c2c930](https://github.com/stonith404/pingvin-share/commit/8c2c930153e0a271acf4896276b820c1ad6c0b8b))
* share not found if unauthenticated ([aa5b125](https://github.com/stonith404/pingvin-share/commit/aa5b12536723c1697a0e876f1f4f901cb4d4b33e))
* space in actions ([dcd39ee](https://github.com/stonith404/pingvin-share/commit/dcd39ee612e048437ed1b11486700cb91e7d377c))
* spacing issues ([43519d9](https://github.com/stonith404/pingvin-share/commit/43519d9f26a4d26e3d6132efe8c88d0d107540ce))
* system test github action ([a2c9755](https://github.com/stonith404/pingvin-share/commit/a2c9755756932086c63a282330f80e410137b1d9))
* upload volume path ([7522221](https://github.com/stonith404/pingvin-share/commit/7522221ee163cb0bd6144e7b924c77065f223fb9))
* wrong environment configuration for `ALLOW_REGISTRATION` ([759db40](https://github.com/stonith404/pingvin-share/commit/759db40ac9f42ff71a795ceec521a7f9531d71c9))

