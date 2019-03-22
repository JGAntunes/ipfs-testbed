.PHONY: install delete

install:
	kubectl apply -f ./ipfs-testbed.yaml
	kubectl apply -f ./elastic.yaml

delete:
	kubectl delete -f ./ipfs-testbed.yaml 
	kubectl delete -f ./elastic.yaml 
