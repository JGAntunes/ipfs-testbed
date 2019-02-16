SHELL := /bin/bash

.PHONY: install delete

NODE_NUMBER?=1
NODE_FROM?=0
BOOTSTRAP_NUMBER?=3

all:
	$(MAKE) clean
	$$(echo '{"ipfs": {"config": {"Bootstrap": []}}}' > values.json) ; \
	# Setup bootstrap nodes
	NODE_NUMBER=$(BOOTSTRAP_NUMBER) $(MAKE) install
	# Get node ids and build its swarm addresses
	n=${BOOTSTRAP_NUMBER} ; while [ "$$n" -gt 0 ]; do \
		name=$$(kubectl get pods -l "app.kubernetes.io/instance=node-$$n" -o jsonpath='{.items[0].metadata.name}') ; \
		service=$$(kubectl get services -l "app.kubernetes.io/instance=node-$$n" -o jsonpath='{.items[0].metadata.name}') ; \
		id=$$(kubectl exec $$name --container=js-ipfs jsipfs id | jq -r ".id | tostring") ; \
		address="/dns4/$$service/tcp/8002/ipfs/$$id" ; \
		config=$$(cat values.json) ; \
		$$(echo $$config | jq -c -r ".ipfs.config.Bootstrap += [\"$$address\"] " >values.json); \
		n=$$((n - 1)) ; \
	done ;
	# Setup remaining nodes
	NODE_FROM=$(BOOTSTRAP_NUMBER) $(MAKE) install

install:
	helm repo add jgantunes https://jgantunes.github.io/helm-charts
	n=$(NODE_NUMBER) ; while [ $${n} -gt $(NODE_FROM) ] ; do \
		helm upgrade --install \
			--wait --timeout 600 \
			--tiller-namespace ipfs-testbed \
			--namespace ipfs-testbed \
			--set ipfs.config.Discovery.webRTCStar.Enabled=false \
			--set ipfs.env[0].name=DEBUG \
			--set ipfs.env[0].value="libp2p*\,libp2p:dht*\,jsipfs*" \
			--set ipfs.config.Addresses.Swarm[0]="/ip4/127.0.0.1/tcp/4002/dns4/node-$${n}-ipfs-testbed/tcp/8002" \
			--set ipfs.config.Addresses.API="/ip4/0.0.0.0/tcp/5002" \
			--set toxiproxy.config[0].name="ipfs_swarm" \
			--set toxiproxy.config[0].listen="0.0.0.0:8002" \
			--set toxiproxy.config[0].upstream="127.0.0.1:4002" \
			node-$${n} \
			-f values.json \
			jgantunes/ipfs-testbed ; \
			name=$$(kubectl get pods -l "app.kubernetes.io/instance=node-$$n" -o jsonpath='{.items[0].metadata.name}') ; \
			id=$$(kubectl exec $$name --container=js-ipfs jsipfs id | jq -r ".id | tostring") ; \
			kubectl label all -l "app.kubernetes.io/instance=node-$$n" ipfs-testbed/ipfs-id=$${id} ; \
    n=$$((n - 1)) ; \
	done;

clean:
	rm -f values.json

delete:
	n=$(NODE_NUMBER) ; while [ $${n} -gt 0 ] ; do \
		helm delete --purge node-$${n} --tiller-namespace ipfs-testbed; \
    n=$$((n - 1)) ; \
	done;
