.PHONY: install delete

STORAGE_CLASS?=standard

install:
	helm repo add elastic https://helm.elastic.co
	helm upgrade --install \
		--tiller-namespace elastic \
		--namespace elastic \
		-f values.yaml \
		--set volumeClaimTemplate.storageClassName="$(STORAGE_CLASS)" \
		elasticsearch \
		elastic/elasticsearch

delete:
	helm delete --purge elasticsearch --tiller-namespace elastic
