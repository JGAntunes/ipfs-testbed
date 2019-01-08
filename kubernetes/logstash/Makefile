.PHONY: install delete

install:
	helm upgrade --install \
		--tiller-namespace ipfs-testbed \
		--namespace ipfs-testbed \
		-f values.yaml \
		logstash \
		stable/logstash

delete:
	helm delete --purge logstash --tiller-namespace ipfs-testbed
