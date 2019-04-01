.PHONY: install delete

install:
	helm upgrade --install \
		--namespace kube-system \
		-f values.yaml \
		--version 1.2.1 \
		metricbeat \
		stable/metricbeat

delete:
	helm delete --purge metricbeat
