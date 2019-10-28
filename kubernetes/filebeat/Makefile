.PHONY: install delete

install:
	helm repo add elastic https://helm.elastic.co
	helm upgrade --install \
		--namespace kube-system \
		-f values.yaml \
		filebeat \
		elastic/filebeat

delete:
	helm delete --purge filebeat
