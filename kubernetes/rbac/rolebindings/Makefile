.PHONY: install delete

install:
	kubectl apply -f ./ipfs-testbed-admin.yaml
	kubectl apply -f ./kube-system-admin.yaml
	kubectl apply -f ./elastic-admin.yaml

delete:
	kubectl delete -f ./ipfs-testbed-admin.yaml
	kubectl delete -f ./kube-system-admin.yaml
	kubectl delete -f ./elastic-admin.yaml
