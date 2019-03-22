.PHONY: install delete

install:
	helm upgrade --install \
		--namespace kube-system \
		metrics-server \
		stable/metrics-server

delete:
	helm delete --purge metrics-server
