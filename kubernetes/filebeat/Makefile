.PHONY: install delete

install:
	helm upgrade --install \
		--namespace kube-system \
		-f values.yaml \
		filebeat \
		stable/filebeat

delete:
	helm delete --purge filebeat
