.PHONY: install delete

install:
	helm upgrade --install \
		--tiller-namespace elastic \
		--namespace elastic \
		-f values.yaml \
		--version 1.8.0 \
		logstash \
		stable/logstash

delete:
	helm delete --purge logstash --tiller-namespace elastic
