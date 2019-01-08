.PHONY: install delete

install:
	helm repo add elastic https://helm.elastic.co
	helm upgrade --install \
		--tiller-namespace ipfs-testbed \
		--namespace ipfs-testbed \
		-f values.yaml \
		elasticsearch \
		elastic/elasticsearch

delete:
	helm delete --purge elasticsearch --tiller-namespace ipfs-testbed
