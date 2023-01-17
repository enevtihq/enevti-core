# Changelog

All notable changes to this project will be documented in this file.

## [Testnet Preparation](https://github.com/enevtihq/enevti-core/compare/ca0006b57058186adc058e137484858e65bc68db..8876d1bdf1cda56e548c2204e81471ee0c4a41a5) - 2023-01-16

### Added

- add README for testnet docker image [`017a560`](https://github.com/enevtihq/enevti-core/commit/017a56055845398b1f046ec1d8e629e96ef2d9a2)
- add Dockerfile container for testnet deployment [`e785c63`](https://github.com/enevtihq/enevti-core/commit/e785c63ad8a3ac27b5567ee3a9264eae269e4746)
- setup configuration for testnet [`ca0006b`](https://github.com/enevtihq/enevti-core/commit/ca0006b57058186adc058e137484858e65bc68db)
- add more info to README [`1b384f3`](https://github.com/enevtihq/enevti-core/commit/1b384f39ce0172e419f1e685b0b439bb1b1f5a23)
- add --enable-enevti-plugins flag to start command; improve configs [`d354eeb`](https://github.com/enevtihq/enevti-core/commit/d354eebd12a5c19907d41abde1ae11efb5332e93)

### Changed

- update testnet docker file [`89854e1`](https://github.com/enevtihq/enevti-core/commit/89854e1ef600c2f4a0671189ff900f1cd3e114a2)
- change genesis delegate username for testnet [`69ce457`](https://github.com/enevtihq/enevti-core/commit/69ce457d884d5f6c99e4b9e811cd86b92eef2ced)
- update docker readme [`46dcdc2`](https://github.com/enevtihq/enevti-core/commit/46dcdc2d8d52f37c832d542790099eafe867bf71)

### Fixed

- fix config version [`9fb9430`](https://github.com/enevtihq/enevti-core/commit/9fb9430ac64d59f26f25b38af53fddc5eaf49c1f)
- fix set&lt;buffer&gt; and change it to string [`602c84a`](https://github.com/enevtihq/enevti-core/commit/602c84a742d68a4d6166fbcbe38ab2a7a9331913)

### Security

- implement asset validation for all transaction [`0b14d13`](https://github.com/enevtihq/enevti-core/commit/0b14d13cde3179a5a75c3825b7fdd8533a863a81)

## [Moment (Proof-of-Redeem)](https://github.com/enevtihq/enevti-core/compare/d117ccadbac2d0c5aacd74af91e47d57925f4a31..1c284e6234cd1c990042bbe0495de55670e41173) - 2023-01-07

[Blog Post](https://blog.enevti.com/enevti-com-development-update-introducing-proof-of-redeem-aa222d6c5617?gi=2cc8c0057161&source=rss-------1)

### Added

- add moment authorized endpoint [`e6a654b`](https://github.com/enevtihq/enevti-core/commit/e6a654bd6e0a18c35133058e2536d9b04633e2e9)
- add get nft moment by id endpoint [`be27885`](https://github.com/enevtihq/enevti-core/commit/be27885726aa395276bf41aee62e1bb57ac0ac15)
- add moment at endpoint and collection [`60fa904`](https://github.com/enevtihq/enevti-core/commit/60fa904fdcd8caaab25d33ca73b790d2da3faeca)
- apply hook for mint moment transaction [`30fed44`](https://github.com/enevtihq/enevti-core/commit/30fed4479a7b05913a7cb99d88aba8fb7a71862e)
- add totalMomentSlotChanged socket event [`292b7d2`](https://github.com/enevtihq/enevti-core/commit/292b7d2bca8cfa4697d3729a0e0cad511bd09337)
- add width param to avatar renderer API [`39b79d9`](https://github.com/enevtihq/enevti-core/commit/39b79d96e9182d494ad2caf763cedfd6271841ee)
- implement ipfs text cache for comments [`b4d621f`](https://github.com/enevtihq/enevti-core/commit/b4d621ff44d2382f6ad9888e09a8153e3c348766)
- create ipfs text cache plugin [`ffea7c6`](https://github.com/enevtihq/enevti-core/commit/ffea7c665a943264fa86f258e6d1543cdd3c5d50)
- auto resize ipfs image when creating new NFT [`4aee7b9`](https://github.com/enevtihq/enevti-core/commit/4aee7b9785d90a393161e60c60df65074a05ce74)
- initial ipfs_image_resized plugin implementation [`237cc71`](https://github.com/enevtihq/enevti-core/commit/237cc71652abc7eb2420e1980bcc08e58cf0dc31)
- add node-fetch and sharp package [`04c09de`](https://github.com/enevtihq/enevti-core/commit/04c09de20442e4f2b5605bbd84ae0de12471a9a2)
- add address feeds api endpoint [`7d2b3a8`](https://github.com/enevtihq/enevti-core/commit/7d2b3a896554434058f20dc8b17749f61e5eac94)
- add profile moment slot api endpoint [`ab6aee5`](https://github.com/enevtihq/enevti-core/commit/ab6aee5eda7a68af9aee4e379b0eacc2e41795fa)
- add like moment api endpoint [`f959833`](https://github.com/enevtihq/enevti-core/commit/f9598333c9afe0f7a3cd3b2e1778aea010495b56)
- add like moment transaction [`125da0b`](https://github.com/enevtihq/enevti-core/commit/125da0ba13a196b93c6ad636bbdc8113eae90d99)
- add comment moment clubs api endpoint [`e0f2eec`](https://github.com/enevtihq/enevti-core/commit/e0f2eecfed55b84ea63b9b785c0cc0137bea846f)
- add comment moment clubs transaction [`623d09e`](https://github.com/enevtihq/enevti-core/commit/623d09e56073fe29dec17b2454cc7b62cb769951)
- add moment comment api endpoint [`b78bfc8`](https://github.com/enevtihq/enevti-core/commit/b78bfc81610f22505dfd4f9c778e658af2e96cce)
- add moment comment transaction [`dc843e0`](https://github.com/enevtihq/enevti-core/commit/dc843e0b08ad5d886cc437673a51a4a0edce6e8a)
- implement api endpoint for moment [`b442478`](https://github.com/enevtihq/enevti-core/commit/b44247833c3c2aedf998940deb8d348a7aee92e2)
- add activities to create moment transaction [`2e95e5b`](https://github.com/enevtihq/enevti-core/commit/2e95e5b1a3f8772820dc867dc758aeaedd504ea1)
- add create moment asset [`8eca2e1`](https://github.com/enevtihq/enevti-core/commit/8eca2e1a3cdd3596e8da12437519d01e555127f5)
- add momentCreated [`87c02f5`](https://github.com/enevtihq/enevti-core/commit/87c02f5ffe09a504f815744d1a9de7ff8f5db0f9)
- initial moment chain setup [`d117cca`](https://github.com/enevtihq/enevti-core/commit/d117ccadbac2d0c5aacd74af91e47d57925f4a31)

### Changed

- improve moment API and viewer indicator for liked [`e927113`](https://github.com/enevtihq/enevti-core/commit/e9271139e7c846db08d82f2ef63595ca9a61fff3)
- no minimize moment on endpoint [`8c5964c`](https://github.com/enevtihq/enevti-core/commit/8c5964c697b721bd2fc0315ecba34d848ae4940f)
- add nft base data to moment [`189f8ef`](https://github.com/enevtihq/enevti-core/commit/189f8efeae01fa71ddd2bcaa3ef870c7c0c3ac5d)
- add moment list to nft endpoint [`02af472`](https://github.com/enevtihq/enevti-core/commit/02af4721c700e938bb677e8fc61f7ce75dcee764)
- minimize moment response [`add044f`](https://github.com/enevtihq/enevti-core/commit/add044f55afda83d401ac4d10154521f6ea21c79)
- add moment data to collection endpoint [`95e6d16`](https://github.com/enevtihq/enevti-core/commit/95e6d1610b137a69ab5deece4c14163cf87c3b8f)
- add pagination to profile moment API endpoint [`0fec749`](https://github.com/enevtihq/enevti-core/commit/0fec74924c9eec69b404fe24869ae25c42436456)
- get profile moment slot optimization [`eeddd45`](https://github.com/enevtihq/enevti-core/commit/eeddd456a6d99c43a3dac13c0a71a5a14405e216)
- improve several endpoint error handling [`18501c8`](https://github.com/enevtihq/enevti-core/commit/18501c8fbd6d3909d67f45fada23aac2280a0f3b)
- improve typing [`8daf81b`](https://github.com/enevtihq/enevti-core/commit/8daf81b28e5302f2018a7b6bb0ad940cc541620a)
- improve api endpoint to accept custom limit [`42f9246`](https://github.com/enevtihq/enevti-core/commit/42f9246de44bf7f92b27daa3cbf47a57e6148184)
- update nft secret format on chain [`3e5063e`](https://github.com/enevtihq/enevti-core/commit/3e5063efe045be9bdb81e8c24a77e18b85c7e081)
- improve api format & data [`b3e96f8`](https://github.com/enevtihq/enevti-core/commit/b3e96f8ede5644d1b463905ecbfb1953234f291d)
- optimize get profile api endpoint [`b236bb3`](https://github.com/enevtihq/enevti-core/commit/b236bb374e8c6c99686cf7b47908f9d60752fa69)
- change create moment to mint moment [`c7f9198`](https://github.com/enevtihq/enevti-core/commit/c7f91987fed2e30f7583700bb6d00180516fc0a4)
- refactor & add activity moment [`a4d40e6`](https://github.com/enevtihq/enevti-core/commit/a4d40e6ff218689a8a0936ea898ea4fdfa23da2d)

### Fixed

- fix getAllMoment endpoint to add pagination data [`1c284e6`](https://github.com/enevtihq/enevti-core/commit/1c284e6234cd1c990042bbe0495de55670e41173)
- fix moment on-chain ownership data [`92c5364`](https://github.com/enevtihq/enevti-core/commit/92c5364199676a1d35b83bd360984c873bcdd368)
- fix error for buffer to moment [`0189b9d`](https://github.com/enevtihq/enevti-core/commit/0189b9d5e6781105bdc54e78715c299ddd9e3327)
- typo [`495e2f7`](https://github.com/enevtihq/enevti-core/commit/495e2f7f99262b195c674e2304f5cf69932347fd)
- fix moment endpoint in feeds and profile [`3470297`](https://github.com/enevtihq/enevti-core/commit/3470297b48408413ab8f2f9d6224181042c74a08)
- fix moment in feed endpoint [`9e42e0a`](https://github.com/enevtihq/enevti-core/commit/9e42e0af0b21dc9bebb88a87be9922409ac4f958)
- fix self mint [`a5e0e1e`](https://github.com/enevtihq/enevti-core/commit/a5e0e1e1ee1ab684b3f0eebbca90fef5b0e81756)
- fix renderAvatar width param [`fa24ab0`](https://github.com/enevtihq/enevti-core/commit/fa24ab098442406c547c7b73875966cf960d3ccc)
- fix moment slot logic for exclusive content utility [`48e9502`](https://github.com/enevtihq/enevti-core/commit/48e9502aeeede0258f2a4828e5a320985221bc7f)
- end of file [`eb1cd43`](https://github.com/enevtihq/enevti-core/commit/eb1cd433fb2396ea43b556d4232d87d72b6c4a8e)
- fix feeds api endpoint [`7837957`](https://github.com/enevtihq/enevti-core/commit/78379574bc96b0a9d6e8390189410a555246f5b9)

### Security

- fix unit test [`4d1e9ac`](https://github.com/enevtihq/enevti-core/commit/4d1e9ac5248bd833496f21346735e5bb223015ff)

## [NFT Utility: Video Call](https://github.com/enevtihq/enevti-core/compare/fc72a91b69d6b47de738f782ba856950dfa76614..1b384f39ce0172e419f1e685b0b439bb1b1f5a23) - 2022-10-27

[Blog Post](https://blog.enevti.com/enevti-com-development-update-introducing-nft-utility-exclusive-video-call-6ef9964f051f?source=rss-32f9188f8899------2)

### Added

- add call cancelled socket event [`d895817`](https://github.com/enevtihq/enevti-core/commit/d895817580fac6db1b78feb317e74dd394fcb419)
- add fee to profile activity endpoint [`0c4a145`](https://github.com/enevtihq/enevti-core/commit/0c4a145b4cee3f208d247d2b9f8a73afdd5ab323)
- add apn plugin endpoint [`e654557`](https://github.com/enevtihq/enevti-core/commit/e65455703584c061294ed5180619daae0fa8772a)
- implement ios voip to enevti_call_socket [`2460ea8`](https://github.com/enevtihq/enevti-core/commit/2460ea81f16dd0356a68f67f83f2ee8b889183aa)
- implement apns off-chain plugin [`6a87bd6`](https://github.com/enevtihq/enevti-core/commit/6a87bd642077fabc7fdfa613bbaaf6e9c4559def)
- implement user meta plugin [`f2276ea`](https://github.com/enevtihq/enevti-core/commit/f2276ea8d07c37c1674ef7907a83763cc08efd48)
- add fcm check token updated endpoint [`7d6e6fc`](https://github.com/enevtihq/enevti-core/commit/7d6e6fc2088389276a3448dd9d1dde15d58c8dfb)
- implement send tip socket logic [`4a86baf`](https://github.com/enevtihq/enevti-core/commit/4a86baf46b62790f59f0885e4b51a6bb1498817e)
- implement in-call chat backend logic [`6b387d8`](https://github.com/enevtihq/enevti-core/commit/6b387d87b9a131a123cb0c11c5d3f4ffd6d55290)
- implement on-chain video call accept & reject; fix bugs [`3251f6d`](https://github.com/enevtihq/enevti-core/commit/3251f6da0ee166dfcf15ff259af841af06e364bb)
- implement recover call logic & fix on chain videocall module [`964134e`](https://github.com/enevtihq/enevti-core/commit/964134e2a1a47536abd8fb09662a32f83d437d3c)
- add on-chain transaction for video call [`edac057`](https://github.com/enevtihq/enevti-core/commit/edac057b59b670d511eed4b35c7791820e9b5aa5)
- change comment storage to IPFS, and store the CID on chain [`3b5cdc2`](https://github.com/enevtihq/enevti-core/commit/3b5cdc2e21382801f73aee30cc09e4d6a73403a7)
- add busy & reconnect logic; fix redeem date logic [`e2820a3`](https://github.com/enevtihq/enevti-core/commit/e2820a37a40c6d2023d9e2f3a3a79e1c7883cd29)
- disconnect video call if one of participant is disconnected [`144f40b`](https://github.com/enevtihq/enevti-core/commit/144f40b086b844d191679b5e068ab41e1ebec4a3)
- add avatar renderer http api [`c42d628`](https://github.com/enevtihq/enevti-core/commit/c42d6285725d2324763589e78a26215b6e66a753)
- add twilio utils function [`0eff203`](https://github.com/enevtihq/enevti-core/commit/0eff20361c0eee37cc67519c3e3ea90dc9721c1a)
- add initial other call event [`1c8543a`](https://github.com/enevtihq/enevti-core/commit/1c8543a6aedfd59145e9a3ea7ba29563a0167317)
- call can be initiated by creator or owner [`c22a8b6`](https://github.com/enevtihq/enevti-core/commit/c22a8b6353041e504196f4c4c17ec6a9541c882e)
- setup dotenv-vault [`cf11f3f`](https://github.com/enevtihq/enevti-core/commit/cf11f3f3db0bb3d634f158a6b112dd29c14769d2)
- twilio config setup [`83fe590`](https://github.com/enevtihq/enevti-core/commit/83fe590cc69fcbaba7af92b9fe833f56e6f4730c)
- add initial call socket plugin & refactor [`e860954`](https://github.com/enevtihq/enevti-core/commit/e8609542775af1c76204514431597bc17310b697)
- add fcm off-chain plugin & socket to address mapper [`fc72a91`](https://github.com/enevtihq/enevti-core/commit/fc72a91b69d6b47de738f782ba856950dfa76614)

### Changed

- improve call performance & security [`06f01db`](https://github.com/enevtihq/enevti-core/commit/06f01dbf3b48a920df7108f7e3d99b738ad1d3a6)
- adjust start video call payload according to ios voip spec [`d93a97a`](https://github.com/enevtihq/enevti-core/commit/d93a97aba37476be6ed30b4a869af7d27de92481)
- improve start video call payload [`d5d49b9`](https://github.com/enevtihq/enevti-core/commit/d5d49b99f2d97568dbbb49304d3fe450efb16d01)
- improve call socket handling [`e341f89`](https://github.com/enevtihq/enevti-core/commit/e341f890e1b96e6fd7c8895968218f16decc31eb)
- improve video call socket plugin [`0f45578`](https://github.com/enevtihq/enevti-core/commit/0f455785ca5bf71c946229db605dce68de2e94dd)
- change background avatar to rect [`8525840`](https://github.com/enevtihq/enevti-core/commit/8525840e48ac6e390b1fc22a94fa122d33fa729c)

### Fixed

- fix get nft by serial endpoint [`a4c6196`](https://github.com/enevtihq/enevti-core/commit/a4c61961b335dd685f7b2b41909e8c9e22a43671)
- fix bugs on apn registration & video call [`ff812df`](https://github.com/enevtihq/enevti-core/commit/ff812dfa18eb9a8d0d80b3e26a84fe85f3152c59)
- fix usermeta plugin [`82886e6`](https://github.com/enevtihq/enevti-core/commit/82886e6ebdadeeafd2ef5d1307dce121e0c51efc)
- fix redeem time bug [`7419479`](https://github.com/enevtihq/enevti-core/commit/7419479d920ac1f08dd24f6669686bc3b999b2c1)
- fix socket reconnection join logic [`2990da1`](https://github.com/enevtihq/enevti-core/commit/2990da1f18ed77b63934252280051769f2a74818)
- fix call busy event [`e903b53`](https://github.com/enevtihq/enevti-core/commit/e903b5391371ae61a38a2d53332db7df5dd2c241)
- fix reconnection and disconnect logic for video call [`8103934`](https://github.com/enevtihq/enevti-core/commit/8103934bc283471920552ced900e8882f9bc74a2)
- fix daily & monthly redeem date parsing [`f58934b`](https://github.com/enevtihq/enevti-core/commit/f58934b42bee27e304b85401855830eb0beaea4d)
- fix redeem date utils function [`8c89924`](https://github.com/enevtihq/enevti-core/commit/8c899243d15ed795759213a1cd17795d14e8d75d)

### Security

- secure call socket [`67ac70f`](https://github.com/enevtihq/enevti-core/commit/67ac70f0b517389f71c1f7b32c6af8dffc409628)
- improve rejected call handling [`a6977f6`](https://github.com/enevtihq/enevti-core/commit/a6977f64c14012f45c6be476c772f62deaed9b15)
- error handling for call socket [`919fd8d`](https://github.com/enevtihq/enevti-core/commit/919fd8d4de5d6c8236a1ebb19b40401476cc5921)
- remove apiClient from module, and add delayEmit to every socket event [`eebdd4e`](https://github.com/enevtihq/enevti-core/commit/eebdd4e4e1e0ce2f44adf8ee2d91f8a0494a8bfc)
