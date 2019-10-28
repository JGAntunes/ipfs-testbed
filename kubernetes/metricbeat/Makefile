.PHONY: install delete

install:
	helm repo add elastic https://helm.elastic.co
	helm upgrade --install \
		--namespace kube-system \
		-f values.yaml \
		metricbeat \
		elastic/metricbeat

delete:
	helm delete --purge metricbeat
