.PHONY: install delete

install:
	helm repo add elastic https://helm.elastic.co
	helm upgrade --install \
		--tiller-namespace ipfs-testbed \
		--namespace ipfs-testbed \
		-f values.yaml \
		kibana \
		elastic/kibana

delete:
	helm delete --purge kibana --tiller-namespace ipfs-testbed
