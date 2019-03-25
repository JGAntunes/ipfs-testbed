.PHONY: install delete

install:
	helm repo add elastic https://helm.elastic.co
	helm upgrade --install \
		--tiller-namespace elastic \
		--namespace elastic \
		-f values.yaml \
		--version 6.6.2-alpha1 \
		kibana \
		elastic/kibana

delete:
	helm delete --purge kibana --tiller-namespace elastic
