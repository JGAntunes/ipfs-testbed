.PHONY: install delete

install:
	helm upgrade --install \
		--namespace kube-system \
		kube-state-metrics \
		stable/kube-state-metrics

delete:
	helm delete --purge kube-state-metrics
