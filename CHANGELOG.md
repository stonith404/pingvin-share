## [0.21.2](https://github.com/stonith404/pingvin-share/compare/v0.21.1...v0.21.2) (2023-12-29)


### Bug Fixes

* missing logo images on fresh installation ([6fb31ab](https://github.com/stonith404/pingvin-share/commit/6fb31abd84b22cd464b6b45bf7ca6f83853e8720))
* missing translations on reset password page ([7a301b4](https://github.com/stonith404/pingvin-share/commit/7a301b455cdea4b1dbc04cc6223e094fee9aca7b))

## [0.21.1](https://github.com/stonith404/pingvin-share/compare/v0.21.0...v0.21.1) (2023-12-20)


### Features

* **oauth:** add oidc username claim ([#357](https://github.com/stonith404/pingvin-share/issues/357)) ([3ea52a2](https://github.com/stonith404/pingvin-share/commit/3ea52a24ef7c3b6845bc13382616ea0c8d784585))

## [0.21.0](https://github.com/stonith404/pingvin-share/compare/v0.20.3...v0.21.0) (2023-12-01)


### Features

* **oauth:** limited discord server sign-in ([#346](https://github.com/stonith404/pingvin-share/issues/346)) ([5f94c72](https://github.com/stonith404/pingvin-share/commit/5f94c7295ab8594ed2ed615628214e869a02da2d))

## [0.20.3](https://github.com/stonith404/pingvin-share/compare/v0.20.2...v0.20.3) (2023-11-17)


### Bug Fixes

* max expiration gets ignored if expiration is set to "never" ([330eef5](https://github.com/stonith404/pingvin-share/commit/330eef51e4f3f3fb29833bc9337e705553340aaa))

## [0.20.2](https://github.com/stonith404/pingvin-share/compare/v0.20.1...v0.20.2) (2023-11-11)


### Bug Fixes

* **oauth:** github and discord login error ([#323](https://github.com/stonith404/pingvin-share/issues/323)) ([fd44f42](https://github.com/stonith404/pingvin-share/commit/fd44f42f28c0fa2091876b138f170202d9fde04e)), closes [#322](https://github.com/stonith404/pingvin-share/issues/322) [#302](https://github.com/stonith404/pingvin-share/issues/302)
* reverse shares couldn't be created unauthenticated ([966ce26](https://github.com/stonith404/pingvin-share/commit/966ce261cb4ad99efaadef5c36564fdfaed0d5c4))

## [0.20.1](https://github.com/stonith404/pingvin-share/compare/v0.20.0...v0.20.1) (2023-11-05)


### Bug Fixes

* share information text color in light mode ([1138cd0](https://github.com/stonith404/pingvin-share/commit/1138cd02b0b6ac1d71c4dbc2808110c672237190))

## [0.20.0](https://github.com/stonith404/pingvin-share/compare/v0.19.2...v0.20.0) (2023-11-04)


### Features

* ability to add and delete files of existing share ([#306](https://github.com/stonith404/pingvin-share/issues/306)) ([98380e2](https://github.com/stonith404/pingvin-share/commit/98380e2d48cc8ffa831d9b69cf5c0e8a40e28862))

## [0.19.2](https://github.com/stonith404/pingvin-share/compare/v0.19.1...v0.19.2) (2023-11-03)


### Features

* ability to limit the max expiration of a share ([bbfc9d6](https://github.com/stonith404/pingvin-share/commit/bbfc9d6f147eea404f011c3af9d7dc7655c3d21d))
* change totp issuer to display logo in 2FAS app ([e0fbbec](https://github.com/stonith404/pingvin-share/commit/e0fbbeca3c1a858838b20aeead52694772b7d871))


### Bug Fixes

* jwt secret changes on application restart ([33742a0](https://github.com/stonith404/pingvin-share/commit/33742a043d6549783984ae7e8a3c30f0fe3917de))
* wrong validation of setting max share expiration to `0` ([acc35f4](https://github.com/stonith404/pingvin-share/commit/acc35f47178e230f50ce54d6f1ad5370caa3382d))

## [0.19.1](https://github.com/stonith404/pingvin-share/compare/v0.19.0...v0.19.1) (2023-10-22)


### Bug Fixes

* **oauth:** fix wrong redirectUri in oidc after change appUrl ([#296](https://github.com/stonith404/pingvin-share/issues/296)) ([119b1ec](https://github.com/stonith404/pingvin-share/commit/119b1ec840ad7f4e1c7c4bb476bf1eeed91d9a1a))

## [0.19.0](https://github.com/stonith404/pingvin-share/compare/v0.18.2...v0.19.0) (2023-10-22)


### Features

* **auth:** add OAuth2 login ([#276](https://github.com/stonith404/pingvin-share/issues/276)) ([02cd98f](https://github.com/stonith404/pingvin-share/commit/02cd98fa9cf9865d91494848aabaf42b19e4957b)), closes [#278](https://github.com/stonith404/pingvin-share/issues/278) [#279](https://github.com/stonith404/pingvin-share/issues/279) [#281](https://github.com/stonith404/pingvin-share/issues/281)


### Bug Fixes

* delete unfinished shares after a day ([d327bc3](https://github.com/stonith404/pingvin-share/commit/d327bc355c8583231e058731934cf51ab25d9ce5))

## [0.18.2](https://github.com/stonith404/pingvin-share/compare/v0.18.1...v0.18.2) (2023-10-09)


### Bug Fixes

* disable image optimizations for logo to prevent caching issues with custom logos ([3891900](https://github.com/stonith404/pingvin-share/commit/38919003e9091203b507d0f0b061f4a1835ff4f4))
* memory leak while downloading large files ([97e7d71](https://github.com/stonith404/pingvin-share/commit/97e7d7190dfe219caf441dffcd7830c304c3c939))

## [0.18.1](https://github.com/stonith404/pingvin-share/compare/v0.18.0...v0.18.1) (2023-09-22)


### Bug Fixes

* permission changes of docker container brakes existing installations ([6a4108e](https://github.com/stonith404/pingvin-share/commit/6a4108ed6138e7297e66fd1e38450f23afe99aae))

## [0.18.0](https://github.com/stonith404/pingvin-share/compare/v0.17.5...v0.18.0) (2023-09-21)


### Features

* show upload modal on file drop ([13e7a30](https://github.com/stonith404/pingvin-share/commit/13e7a30bb96faeb25936ff08a107834fd7af5766))


### Bug Fixes

* **docker:** Updated to newest version of alpine linux and fixed missing dependencies ([#255](https://github.com/stonith404/pingvin-share/issues/255)) ([6fa7af7](https://github.com/stonith404/pingvin-share/commit/6fa7af79051c964060bd291c9faad90fc01a1b72))
* nextjs proxy warning ([e9efbc1](https://github.com/stonith404/pingvin-share/commit/e9efbc17bcf4827e935e2018dcdf3b70a9a49991))

## [0.17.5](https://github.com/stonith404/pingvin-share/compare/v0.17.4...v0.17.5) (2023-09-03)


### Features

* **localization:** Added thai language ([#231](https://github.com/stonith404/pingvin-share/issues/231)) ([bddb87b](https://github.com/stonith404/pingvin-share/commit/bddb87b9b3ec5426a3c7a14a96caf2eb45b93ff7))


### Bug Fixes

* autocomplete on create share modal ([d4e8d4f](https://github.com/stonith404/pingvin-share/commit/d4e8d4f58b9b7d10b865eff49aa784547891c4e8))
* missing translation ([7647a9f](https://github.com/stonith404/pingvin-share/commit/7647a9f620cbc5d38e019225a680a53bd3027698))

## [0.17.4](https://github.com/stonith404/pingvin-share/compare/v0.17.3...v0.17.4) (2023-08-01)


### Bug Fixes

* redirection to `localhost:3000` ([ea0d521](https://github.com/stonith404/pingvin-share/commit/ea0d5216e89346b8d3ef0277b76fdc6302e9de15))

## [0.17.3](https://github.com/stonith404/pingvin-share/compare/v0.17.2...v0.17.3) (2023-07-31)


### Bug Fixes

* logo doesn't get loaded correctly ([9ba2b4c](https://github.com/stonith404/pingvin-share/commit/9ba2b4c82cdad9097b33f0451771818c7b972a6b))
* share expiration never doesn't work if using another language than English ([a47d080](https://github.com/stonith404/pingvin-share/commit/a47d080657e1d08ef06ec7425d8bdafd5a26c24a))

## [0.17.2](https://github.com/stonith404/pingvin-share/compare/v0.17.1...v0.17.2) (2023-07-31)


### Bug Fixes

* `ECONNREFUSED` with Docker ipv6 enabled ([c9a2a46](https://github.com/stonith404/pingvin-share/commit/c9a2a469c67d3c3cd08179b44e2bf82208f05177))

## [0.17.1](https://github.com/stonith404/pingvin-share/compare/v0.17.0...v0.17.1) (2023-07-30)


### Bug Fixes

* rename pt-PT.ts to pt-BR.ts ([2584bb0](https://github.com/stonith404/pingvin-share/commit/2584bb0d48c761940eafc03d5cd98d47e7a5b0ae))

## [0.17.0](https://github.com/stonith404/pingvin-share/compare/v0.16.1...v0.17.0) (2023-07-23)


### Features

* ability to define zip compression level ([7827b68](https://github.com/stonith404/pingvin-share/commit/7827b687fa022e86a2643e7a1951af8c7e80608c))
* add note to language picker ([7f0c31c](https://github.com/stonith404/pingvin-share/commit/7f0c31c2e09b3ee9aae6c3dfb54fac2f2b1dfe23))
* add share url alias `/s` ([231a2e9](https://github.com/stonith404/pingvin-share/commit/231a2e95b9734cf4704454e1945698753dbb378b))
* localization ([#196](https://github.com/stonith404/pingvin-share/issues/196)) ([b9f6e3b](https://github.com/stonith404/pingvin-share/commit/b9f6e3bd08dcfc050048fba582b35958bc7b6184))
* update default value of `maxSize` from `1073741824` to `1000000000` ([389dc87](https://github.com/stonith404/pingvin-share/commit/389dc87cac775d916d0cff9b71d3c5ff90bfe916))


### Bug Fixes

* confusion between GB and GiB ([5816b39](https://github.com/stonith404/pingvin-share/commit/5816b39fc6ef6fe6b7cf8e7925aa297561f5b796))
* mistakes in English translations ([70b425b](https://github.com/stonith404/pingvin-share/commit/70b425b3807be79a3b518cc478996c71dffcf986))
* wrong layout if button text is too long in modals ([f4c88ae](https://github.com/stonith404/pingvin-share/commit/f4c88aeb0823c2c18535c25fcf8e16afa8b53a56))

### [0.16.1](https://github.com/stonith404/pingvin-share/compare/v0.16.0...v0.16.1) (2023-07-10)


### Features

* Adding reverse share ability to copy the link ([#191](https://github.com/stonith404/pingvin-share/issues/191)) ([7574eb3](https://github.com/stonith404/pingvin-share/commit/7574eb3191f21aadd64f436e9e7c78d3e3973a07)), closes [#178](https://github.com/stonith404/pingvin-share/issues/178) [#181](https://github.com/stonith404/pingvin-share/issues/181)
* Adding reverse shares' shares a clickable link ([#190](https://github.com/stonith404/pingvin-share/issues/190)) ([0276294](https://github.com/stonith404/pingvin-share/commit/0276294f5219a7edcc762bc52391b6720cfd741d))


### Bug Fixes

* set link default value to random ([#192](https://github.com/stonith404/pingvin-share/issues/192)) ([a1ea7c0](https://github.com/stonith404/pingvin-share/commit/a1ea7c026594a54eafd52f764eecbf06e1bb4d4e)), closes [#178](https://github.com/stonith404/pingvin-share/issues/178) [#181](https://github.com/stonith404/pingvin-share/issues/181)

## [0.16.0](https://github.com/stonith404/pingvin-share/compare/v0.15.0...v0.16.0) (2023-07-09)


### Features

* Adding more informations on My Shares page (table and modal) ([#174](https://github.com/stonith404/pingvin-share/issues/174)) ([1466240](https://github.com/stonith404/pingvin-share/commit/14662404614f15bc25384d924d8cb0458ab06cd8))
* Adding the possibility of copying the link by clicking text and icons ([#171](https://github.com/stonith404/pingvin-share/issues/171)) ([348852c](https://github.com/stonith404/pingvin-share/commit/348852cfa4275f5c642669b43697f83c35333044))

## [0.15.0](https://github.com/stonith404/pingvin-share/compare/v0.14.1...v0.15.0) (2023-05-09)


### Features

* add env variables for port, database url and data dir  ([98c0de7](https://github.com/stonith404/pingvin-share/commit/98c0de78e8a73e3e5bf0928226cfb8a024b566a1))
* add healthcheck endpoint ([5132d17](https://github.com/stonith404/pingvin-share/commit/5132d177b8ab4e00a7e701e9956222fa2352d42c))
* allow to configure clamav with environment variables ([1df5c71](https://github.com/stonith404/pingvin-share/commit/1df5c7123e4ca8695f4f1b7d49f46cdf147fb920))
* configure ports, db url and api url with env variables ([e5071cb](https://github.com/stonith404/pingvin-share/commit/e5071cba1204093197b72e18d024b484e72e360a))

### [0.14.1](https://github.com/stonith404/pingvin-share/compare/v0.14.0...v0.14.1) (2023-04-07)


### Bug Fixes

* boolean config variables can't be set to false ([39a7451](https://github.com/stonith404/pingvin-share/commit/39a74510c1f00466acaead39f7bee003b3db60d7))

## [0.14.0](https://github.com/stonith404/pingvin-share/compare/v0.13.1...v0.14.0) (2023-04-01)


### Features

* **share, config:** more variables, placeholder and reset default ([#132](https://github.com/stonith404/pingvin-share/issues/132)) ([beece56](https://github.com/stonith404/pingvin-share/commit/beece56327da141c222fd9f5259697df6db9347a))


### Bug Fixes

* bool config variable can't be changed ([0e5c673](https://github.com/stonith404/pingvin-share/commit/0e5c67327092e4751208e559a2b0d5ee2b91b6e3))

### [0.13.1](https://github.com/stonith404/pingvin-share/compare/v0.13.0...v0.13.1) (2023-03-14)


### Bug Fixes

* empty file can't be uploaded in chrome ([9f2097e](https://github.com/stonith404/pingvin-share/commit/9f2097e788dfb79c2f95085025934c3134a3eb38))

## [0.13.0](https://github.com/stonith404/pingvin-share/compare/v0.12.1...v0.13.0) (2023-03-14)


### Features

* add preview modal ([c807d20](https://github.com/stonith404/pingvin-share/commit/c807d208d8f0518f6390f9f0f3d0eb00c12d213b))
* sort shared files ([b25c30d](https://github.com/stonith404/pingvin-share/commit/b25c30d1ed57230096b17afaf8545c7b0ef2e4b1))


### Bug Fixes

* replace "pingvin share" with dynamic app name ([f55aa80](https://github.com/stonith404/pingvin-share/commit/f55aa805167f31864cb07e269a47533927cb533c))
* set password manually input not shown ([8ff417a](https://github.com/stonith404/pingvin-share/commit/8ff417a013a45a777308f71c4f0d1817bfeed6be))
* show line breaks in txt preview ([37e765d](https://github.com/stonith404/pingvin-share/commit/37e765ddc7b19554bc6fb50eb969984b58bf3cc5))
* upload file if it is 0 bytes ([f82099f](https://github.com/stonith404/pingvin-share/commit/f82099f36eb4699385fc16dfb0e0c02e5d55b1e3))

### [0.12.1](https://github.com/stonith404/pingvin-share/compare/v0.12.0...v0.12.1) (2023-03-11)


### Bug Fixes

* 48px icon does not update ([753dbe8](https://github.com/stonith404/pingvin-share/commit/753dbe83b770814115a2576c7a50e1bac9dc8ce1))

## [0.12.0](https://github.com/stonith404/pingvin-share/compare/v0.11.1...v0.12.0) (2023-03-10)


### Features

* ability to change logo in frontend ([8403d7e](https://github.com/stonith404/pingvin-share/commit/8403d7e14ded801c3842a9b3fd87c3f6824c519e))


### Bug Fixes

* crypto is not defined ([8f71fd3](https://github.com/stonith404/pingvin-share/commit/8f71fd343506506532c1a24a4c66a16b1021705f))
* home page shown even if disabled ([3ad6b03](https://github.com/stonith404/pingvin-share/commit/3ad6b03b6bd80168870049582683077b689fa548))

### [0.11.1](https://github.com/stonith404/pingvin-share/compare/v0.11.0...v0.11.1) (2023-03-05)


### Bug Fixes

* old config variable prevents to create a share ([8b77e81](https://github.com/stonith404/pingvin-share/commit/8b77e81d4c1b8a2bf798595f5a66079c40734e09))

## [0.11.0](https://github.com/stonith404/pingvin-share/compare/v0.10.2...v0.11.0) (2023-03-04)


### Features

* custom branding ([#112](https://github.com/stonith404/pingvin-share/issues/112)) ([fddad3e](https://github.com/stonith404/pingvin-share/commit/fddad3ef708c27052a8bf46f3076286d102f6d7e))
* invite new user with email ([f984050](https://github.com/stonith404/pingvin-share/commit/f9840505b82fcb04364a79576f186b76cc75f5c0))


### Bug Fixes

* frontend error when user deleted ([0317f3a](https://github.com/stonith404/pingvin-share/commit/0317f3a508dc88ffe2c33413704f7df03a2372ea))

### [0.10.2](https://github.com/stonith404/pingvin-share/compare/v0.10.1...v0.10.2) (2023-02-13)


### Bug Fixes

* pdf preview tries to render on server ([c3af0fe](https://github.com/stonith404/pingvin-share/commit/c3af0fe097582f69b63ed1ad18fb71bff334d32a))

### [0.10.1](https://github.com/stonith404/pingvin-share/compare/v0.10.0...v0.10.1) (2023-02-12)


### Bug Fixes

* non administrator user redirection error while setup isn't finished ([dc8cf3d](https://github.com/stonith404/pingvin-share/commit/dc8cf3d5ca6b4f8a8f243b8e0b05e09738cf8b61))
* setup wizard doesn't redirect after completion ([7cd9dff](https://github.com/stonith404/pingvin-share/commit/7cd9dff637900098c9f6e46ccade37283d47321b))

## [0.10.0](https://github.com/stonith404/pingvin-share/compare/v0.9.0...v0.10.0) (2023-02-10)


### ⚠ BREAKING CHANGES

* reset password with email

### Features

* allow multiple shares with one reverse share link ([ccdf8ea](https://github.com/stonith404/pingvin-share/commit/ccdf8ea3ae1e7b8520c5b1dd9bea18b1b3305f35))
* **frontend:** server side rendering to improve performance ([38de022](https://github.com/stonith404/pingvin-share/commit/38de022215a9b99c2eb36654f8dbb1e17ca87aba))
* reset password with email ([5d1a7f0](https://github.com/stonith404/pingvin-share/commit/5d1a7f0310df2643213affd2a0d1785b7e0af398))


### Bug Fixes

* delete all shares of reverse share ([86a7379](https://github.com/stonith404/pingvin-share/commit/86a737951951c911abd7967d76cb253c4335cb0c))
* invalid redirection after jwt expiry ([82f204e](https://github.com/stonith404/pingvin-share/commit/82f204e8a93e3113dcf65b1881d4943a898602eb))
* setup status doesn't change ([064ef38](https://github.com/stonith404/pingvin-share/commit/064ef38d783b3f351535c2911eb451efd9526d71))
* share creation without reverseShareToken ([b966270](https://github.com/stonith404/pingvin-share/commit/b9662701c42fe6771c07acb869564031accb2932))
* share fails if a share was created with a reverse share link recently ([edc10b7](https://github.com/stonith404/pingvin-share/commit/edc10b72b7884c629a8417c3c82222b135ef7653))

## [0.9.0](https://github.com/stonith404/pingvin-share/compare/v0.8.0...v0.9.0) (2023-01-31)


### Features

* direct file link ([008df06](https://github.com/stonith404/pingvin-share/commit/008df06b5cf48872d4dd68df813370596a4fd468))
* file preview ([91a6b3f](https://github.com/stonith404/pingvin-share/commit/91a6b3f716d37d7831e17a7be1cdb35cb23da705))


### Bug Fixes

* improve send test email UX ([233c26e](https://github.com/stonith404/pingvin-share/commit/233c26e5cfde59e7d51023ef9901dec2b84a4845))

## [0.8.0](https://github.com/stonith404/pingvin-share/compare/v0.7.0...v0.8.0) (2023-01-26)


### Features

* reverse shares ([#86](https://github.com/stonith404/pingvin-share/issues/86)) ([4a5fb54](https://github.com/stonith404/pingvin-share/commit/4a5fb549c6ac808261eb65d28db69510a82efd00))


### Bug Fixes

* Add meta tags to new pages ([bb64f6c](https://github.com/stonith404/pingvin-share/commit/bb64f6c33fc5c5e11f2c777785c96a74b57dfabc))
* admin users were created while the setup wizard wasn't finished ([ad92cfc](https://github.com/stonith404/pingvin-share/commit/ad92cfc852ca6aa121654d747a02628492ae5b89))

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

