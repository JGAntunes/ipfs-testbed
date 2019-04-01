.PHONY: install delete

install:
	helm upgrade --install \
		--namespace kube-system \
		-f values.yaml \
		--version 1.4.4 \
		filebeat \
		stable/filebeat

delete:
	helm delete --purge filebeat
