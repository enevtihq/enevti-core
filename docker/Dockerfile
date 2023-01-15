FROM node:16.15-alpine3.15

RUN apk --no-cache upgrade && \
    apk --no-cache add --virtual build-dependencies alpine-sdk autoconf automake libtool linux-headers python3

RUN addgroup -g 1100 enevti && \
    adduser -h /home/enevti -s /bin/bash -u 1100 -G enevti -D enevti

USER enevti
WORKDIR /home/enevti

RUN git clone https://github.com/enevtihq/enevti-core.git
WORKDIR /home/enevti/enevti-core
RUN git checkout 9fb9430ac64d59f26f25b38af53fddc5eaf49c1f
RUN npm i
RUN chmod +x /home/enevti/enevti-core/bin/run

USER root
RUN apk --no-cache del build-dependencies

USER enevti
RUN mkdir /home/enevti/.lisk
VOLUME ["/home/enevti/.lisk"]

ENTRYPOINT ["/home/enevti/enevti-core/bin/run"]
CMD ["start", "--network", "testnet"]