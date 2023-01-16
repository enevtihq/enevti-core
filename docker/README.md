
# Using the enevti/core docker image

Docker Image for [enevti-core](https://github.com/enevtihq/enevti-core). Validators can use this [Docker Image](https://github.com/enevtihq/enevti-core/blob/main/docker/Dockerfile) to deploy an enevti node conveniently.

enevti/core does not have any external dependencies and thus does not require using `docker-compose`.

**This enevti/core image currently defaults to running a testnet network.**

## Run

To run using default configuration, simply use [docker run](https://docs.docker.com/engine/reference/commandline/run/) command below:

```
docker run -p 5000:5000 --name enevti-core enevti/core:latest
```

### Persistent Storage

To run with persistent storage, mount a volume to `/home/enevti/.lisk` by using below commands:

```
docker run -p 5000:5000 \
           --name enevti-core \
           -v enevti-data:/home/enevti/.lisk \
           enevti/core:latest
```

### Custom Configuration File

To run the testnet with a custom `config.json` file, use below commands:

```
docker run -p 5000:5000 \
           --name enevti-core \
           -v enevti-data:/home/enevti/.lisk \
           -v {path-to-config}/config.json:/home/enevti/enevti-core/config/testnet/config.json \
           enevti/core:latest
```

## Run with plugins enabled

If you want to run enevti-core with [off-chain plugins](https://github.com/enevtihq/enevti-core/tree/main/src/app/plugins), which will serve additional data and service for frontend, you can follow this guide

### Provide Environment Variables and Config

You must configure required environment variables and provide additional files specific to each plugin. Please use the following commands:

```
docker run -p 5000:5000 -p 8880:8880 -p 8881:8881 -p 8882:8882 -p 8883:8883 \
           --name enevti-core \
           -v enevti-data:/home/enevti/.lisk \
           -e TWILIO_ACCOUNT_SID=<insert value here> \
           -e TWILIO_API_KEY_SECRET=<insert value here> \
           -e TWILIO_API_KEY_SID=<insert value here> \
           -e APN_KEY_ID=<insert value here> \
           -e APN_TEAM_ID=<insert value here> \
           -v {path-to-firebase-json}/firebase.json:/home/enevti/enevti-core/src/app/plugins/firebase_cloud_messaging/firebase.json \
           -v {path-to-apn-p8}/apn.p8:/home/enevti/enevti-core/src/app/plugins/apple_push_notification_service/apn.p8 \
           enevti/core:latest start --enable-enevti-plugins --network=testnet
```

Please notice that you need to publish additional ports, and append `start --enable-enevti-plugins --network=testnet` at the end of the command.

### Provide configuration and .env file

Or you can simply provide an `env` files for those environment variables, and run following commands:

```
docker run -p 5000:5000 -p 8880:8880 -p 8881:8881 -p 8882:8882 -p 8883:8883 \
           --name enevti-core \
           --env-file {path-to-env-file} \
           -v enevti-data:/home/enevti/.lisk \
           -v {path-to-firebase-json}/firebase.json:/home/enevti/enevti-core/src/app/plugins/firebase_cloud_messaging/firebase.json \
           -v {path-to-apn-p8}/apn.p8:/home/enevti/enevti-core/src/app/plugins/apple_push_notification_service/apn.p8 \
           enevti/core:latest start --enable-enevti-plugins --network=testnet
```

For more information about required environment and additional plugins configuration, you can refer to [enevti-core documentation](https://github.com/enevtihq/enevti-core)