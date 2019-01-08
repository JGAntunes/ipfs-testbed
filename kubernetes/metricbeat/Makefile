.PHONY: install delete

install:
	helm upgrade --install \
		--namespace kube-system \
		-f values.yaml \
		metricbeat \
		stable/metricbeat

delete:
	helm delete --purge metricbeat
