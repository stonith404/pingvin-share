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

