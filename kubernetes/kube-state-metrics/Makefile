.PHONY: install delete

install:
	helm upgrade --install \
		--namespace kube-system \
		-f values.yaml \
		kube-state-metrics \
		stable/kube-state-metrics

delete:
	helm delete --purge kube-state-metrics
