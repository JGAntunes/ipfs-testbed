.PHONY: install delete

install:
	kubectl apply -f ./ipfs-testbed-admin.yaml
	kubectl apply -f ./ipfs-testbed-admin-kube-system.yaml

delete:
	kubectl delete -f ./ipfs-testbed-admin.yaml
	kubectl delete -f ./ipfs-testbed-admin-kube-system.yaml
