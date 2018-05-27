# Pulsarcast Test Harness

A test harness built for pulsarcast using [containernet](https://containernet.github.io/).

Although it's still a major work in progress, it should be possible to create virtually any kind of test harness for [IPFS](ipfs.io) using the primitives given here (see [networks](./networks) for some examples). In fact, the project is created in such a way that these modules can eventually be separated (SOON™), so you could virtually run anything as long as it runs in a container.

![demo](./demo.gif)

# Some important notes

The hosts can virtually be anything as long as it's a container but there's a strong requirement for some basic pre-sets. The **docker images used must have ifconfig installed** as containernet relies on it to setup the OpenFlow network between the hosts and switches.

For **IPFS I'm using a [docker image](https://hub.docker.com/r/jgantunes/js-ipfs) fine tuned** for this purpose, which I try to keep updated as much as I can, having **ifconfig installed and a default configuration that strips all the bootsrap nodes and disables multicast DNS**
