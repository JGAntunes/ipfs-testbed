.PHONY: install delete

install:
	helm init --history-max 10 --upgrade --service-account tiller --tiller-namespace kube-system # kube-system
	helm init --history-max 10 --upgrade --service-account tiller --tiller-namespace ipfs-testbed # ipfs-testbed
	helm init --history-max 10 --upgrade --service-account tiller --tiller-namespace elastic # elastic

delete:
	kubectl delete deployment tiller-deploy -n kube-system # kube-system
	kubectl delete deployment tiller-deploy -n ipfs-testbed # ipfs-testbed
	kubectl delete deployment tiller-deploy -n elastic # elastic
