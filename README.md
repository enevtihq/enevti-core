<a name="readme-top"></a>

![Logo](./docs/assets/banner.jpg)

# Enevti Core

![GitHub repo size](https://img.shields.io/github/repo-size/enevtihq/enevti-core?color=black&logo=github&style=for-the-badge)
[![License: Apache 2.0](https://img.shields.io/github/license/enevtihq/enevti-core?logo=apache&style=for-the-badge)](http://www.apache.org/licenses/LICENSE-2.0)
[![Follow @enevtihq](https://img.shields.io/twitter/follow/enevtihq?color=blue&logo=twitter&style=for-the-badge)](https://twitter.com/enevtihq)

[Enevti.com](https://enevti.com/) is an award-winning web3 social media super app with real-world NFT utility!

Enevti Core is the program that implements the [Enevti Protocol](http://link.enevti.com/whitepaper). In other words, Enevti Core is what every machine needs to set-up to run a node that allows for participation in the network. Enevti Core is built using [Lisk SDK](https://github.com/LiskHQ/lisk-sdk).

## Polaris Phase (Decentralization)

We have completed the [Sol Phase](https://enevti.com/roadmap/), where we finish the development of the MVP as the main foundation of future products. You can read more about our MVP on our [blog post](https://blog.enevti.com/lets-meet-enevti-com-mobile-app-alpha-version-92391f87cc8a), as well as development updates on [wallet feature](https://blog.enevti.com/enevti-com-development-update-introducing-built-in-wallet-6a30a268f1cc), and [on-chain social features](https://blog.enevti.com/enevti-com-development-update-introducing-on-chain-nft-social-features-547298dcaf84).

We are currently working on the [Polaris Phase](https://enevti.com/roadmap/) that will bring mainnet, and integration with Lisk ecosystem as an interoperable sidechain.

<!-- TABLE OF CONTENTS -->
<details>
   <summary><strong>Table of Contents</strong></summary>
   <ol>
      <li>
         <a href="#enevti-core">About The Project</a>
         <ul>
            <li><a href="#polaris-phase-decentralization">Roadmap</a></li>
         </ul>
      </li>
      <li>
         <a href="#usage">Usage</a>
         <ul>
            <li><a href="#dependencies">Dependencies</a></li>
            <li><a href="#installation">Installation</a></li>
            <li><a href="#start">Start</a></li>
         </ul>
      </li>
      <li>
         <a href="#configuring-the-plugins">Configuring The Plugins</a>
         <ul>
            <li><a href="#ports-and-environment-variable">Ports and Environment Variable</a></li>
            <li><a href="#twilio-webrtc-go">Twilio WebRTC Go</a></li>
            <li><a href="#firebase-cloud-messaging">Firebase Cloud Messaging</a></li>
            <li><a href="#apple-push-notification-service">Apple Push Notification Service</a></li>
            <li><a href="#start-with-plugin">Start with Plugin</a></li>
         </ul>
      </li>
      <li><a href="#license">License</a></li>
   </ol>
</details>

<!-- USAGE -->

## Usage

### Dependencies

Before running Enevti Core, the following dependencies need to be installed:

| Dependencies | Version |
| ------------ | ------- |
| NodeJS       | 16+     |

If you are using [NVM](https://github.com/nvm-sh/nvm), (Node.js Version Manager), ensure you install the correct version as shown below:

```
nvm install v16.15.0
```

If you are on Ubuntu OS, to build `sodium-native` make sure your system already has `build-essential` installed:

```
sudo apt-get update
sudo apt-get install -y build-essential
```

For Mac M1 series, NodeJS must be above version 16. Additionally, to build `sodium-native` below tools are required:

```
brew install libtool cmake autoconf automake pyenv
pyenv install 2.7.18
pyenv global 2.7.18
# Add `eval "$(pyenv init --path)"` to ~/.zshrc etc
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Installation

To install Enevti Core from source, you can run below commands:

```
git clone https://github.com/enevtihq/enevti-core
cd enevti-core
npm install
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Start

Make sure you have execute permission for `./bin/run` file:

```
chmod +x ./bin/run
```

Finally, run the Enevti Core using these command:

```
./bin/run start --network alphanet
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONFIGURING THE PLUGINS -->

## Configuring The Plugins

By default, Enevti Core will only run the [on-chain modules](https://github.com/enevtihq/enevti-core/tree/main/src/app/modules). If you want to run Enevti Core with [off-chain plugins](https://github.com/enevtihq/enevti-core/tree/main/src/app/plugins), which will serve additional data and service for frontend, you can follow this guide.

### Ports and Environment Variable

First, make sure the following ports are opened for your system:

| Plugins            | Ports |
| ------------------ | ----- |
| enevti_http_api    | 8880  |
| enevti_faucet_api  | 8881  |
| enevti_socket_io   | 8882  |
| enevti_call_socket | 8883  |

Next, Enevti Core Plugins use several third-party services for a specific function. These services need to be configured through environment variables. Create a `.env` file in root folder of this project, and provide values for following variables:

```
TWILIO_ACCOUNT_SID=<insert value here>
TWILIO_API_KEY_SECRET=<insert value here>
TWILIO_API_KEY_SID=<insert value here>
APN_KEY_ID=<insert value here>
APN_TEAM_ID=<insert value here>
APN_KEY_FILE_NAME=<insert value here> # default to apn.p8
APN_IS_PRODUCTION=<insert value here> # default to true
```

Please note that, these informations are required in order to run Enevti Core with plugins. More on these services will be explained below

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Twilio WebRTC Go

The plugin `enevti_call_socket` use [Twilio WebRTC Go](https://www.twilio.com/blog/build-free-one-on-one-video-chat-webrtc-go-javascript) to provide the exclusive video call NFT utility. Please refer to their website in order to setup an account, and get values for `TWILIO_ACCOUNT_SID`, `TWILIO_API_KEY_SECRET`, and `TWILIO_API_KEY_SID`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Firebase Cloud Messaging

Enevti Core use FCM to send a data only notification to mobile device. This is required to initiate an incoming call screen on Android device.

To setup `firebase_cloud_messaging` plugin, please put a `firebase.json` file on `./src/app/plugins/firebase_cloud_messaging/firebase.json`. This file is a Firebase Service Account configuration file. Please refer to [Firebase Official Documentation](https://firebase.google.com/docs/admin/setup) on how to obtain these informations.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Apple Push Notification Service

Enevti Core uses APNs to send a `voip` type notification to iOS device. This is required to initiate an incoming call screen on iPhone device.

To setup `apple_push_notification_service` plugin, please put a `apn.p8` file on `./src/app/plugins/apple_push_notification_service/apn.p8`. If you specify different value for `APN_KEY_FILE_NAME` env, please change the filename accordingly. This file is an APNs Authentication Key file. Please refer to [Apple Documentation](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/establishing_a_token-based_connection_to_apns), or [This Documentation](https://rnfirebase.io/messaging/usage/ios-setup#1-registering-a-key) on how to obtain these files.

Additionally, don't forget to provide env values for `APN_KEY_ID` and `APN_TEAM_ID`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Start with Plugin

To run the Enevti Core with Plugins enabled, please add `--enable-enevti-plugins` flag to the `start` command:

```
./bin/run start --enable-enevti-plugins --network alphanet
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
