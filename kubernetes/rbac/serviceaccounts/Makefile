.PHONY: install delete

install:
	kubectl apply -f ./tiller.yaml
	kubectl apply -f ./tiller-kube-system.yaml
	kubectl apply -f ./tiller-elastic.yaml

delete:
	kubectl delete -f ./tiller.yaml
	kubectl delete -f ./tiller-kube-system.yaml
	kubectl delete -f ./tiller-elastic.yaml
