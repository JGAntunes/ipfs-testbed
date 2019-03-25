SHELL := /bin/bash

.PHONY: install install_multiple install_linked install_bootstraped add_helm_repo delete

HELM_REPO_URL?=https://jgantunes.github.io/helm-charts
HELM_REPO_NAME?=jgantunes
HELM_OPTIONS?=--wait --timeout 600
HELM_NAMESPACE?=ipfs-testbed

NODE_NUMBER?=1
NODE_FROM?=0
BOOTSTRAP_NUMBER?=3

install_bootstraped: clean bootstrap_values.json
	# Setup bootstrap nodes
	NODE_NUMBER=$(BOOTSTRAP_NUMBER) $(MAKE) install_multiple
	# Get node ids and build its swarm addresses
	n=${BOOTSTRAP_NUMBER} ; while [ "$$n" -gt 0 ]; do \
		RELEASE_NAME="node-$${n}" $(MAKE) update_bootstrap_list ; \
		n=$$((n - 1)) ; \
	done ;
	# Setup remaining nodes
	NODE_FROM=$(BOOTSTRAP_NUMBER) $(MAKE) install_multiple

install_linked: clean bootstrap_values.json
	n=$(NODE_NUMBER) ; while [ $${n} -gt 0 ] ; do \
		RELEASE_NAME="node-$${n}" $(MAKE) install ; \
		RELEASE_NAME="node-$${n}" $(MAKE)  replace_bootstrap_list ; \
    n=$$((n - 1)) ; \
	done;

install_multiple:
	n=$(NODE_NUMBER) ; while [ $${n} -gt $(NODE_FROM) ] ; do \
		p=$$(nproc) ; while [ $${p} -gt 0  -a $${n} -gt $(NODE_FROM) ] ; do \
			RELEASE_NAME="node-$${n}" $(MAKE) install & \
    	n=$$((n - 1)) ; \
    	p=$$((p - 1)) ; \
		done ; \
		wait ; \
	done ; 

install: add_helm_repo
	helm upgrade --install \
		$(HELM_OPTIONS) \
		--tiller-namespace $(HELM_NAMESPACE) \
		--namespace $(HELM_NAMESPACE) \
		--set ipfs.config.Addresses.Swarm[0]="/ip4/127.0.0.1/tcp/4002/dns4/$(RELEASE_NAME)-ipfs-testbed/tcp/8002" \
		$(RELEASE_NAME) \
		-f values.yaml \
		-f bootstrap_values.json \
		jgantunes/ipfs-testbed ; \
	name=$$(kubectl -n $(HELM_NAMESPACE) get pods -l "app.kubernetes.io/instance=$(RELEASE_NAME)" -o jsonpath='{.items[0].metadata.name}') ; \
	id=$$(kubectl -n $(HELM_NAMESPACE) exec $$name --container=js-ipfs jsipfs id | jq -r ".id | tostring") ; \
	kubectl -n $(HELM_NAMESPACE) label all -l "app.kubernetes.io/instance=$(RELEASE_NAME)" ipfs-testbed/ipfs-id=$${id} ; \

add_helm_repo:
	helm repo add $(HELM_REPO_NAME) ${HELM_REPO_URL}

replace_bootstrap_list: clean bootstrap_values.json update_bootstrap_list

update_bootstrap_list:
	name=$$(kubectl -n $(HELM_NAMESPACE) get pods -l "app.kubernetes.io/instance=$(RELEASE_NAME)" -o jsonpath='{.items[0].metadata.name}') ; \
	service=$$(kubectl -n $(HELM_NAMESPACE) get services -l "app.kubernetes.io/instance=$(RELEASE_NAME)" -o jsonpath='{.items[0].metadata.name}') ; \
	id=$$(kubectl -n $(HELM_NAMESPACE) exec $$name --container=js-ipfs jsipfs id | jq -r ".id | tostring") ; \
	address="/dns4/$$service/tcp/8002/ipfs/$$id" ; \
	config=$$(cat bootstrap_values.json) ; \
	$$(echo $$config | jq -c -r ".ipfs.config.Bootstrap += [\"$$address\"] " >bootstrap_values.json); \


bootstrap_values.json:
	$$(echo '{"ipfs": {"config": {"Bootstrap": []}}}' > bootstrap_values.json)

clean:
	rm -f bootstrap_values.json

delete:
	n=$(NODE_NUMBER) ; while [ $${n} -gt 0 ] ; do \
		helm delete --purge node-$${n} --tiller-namespace $(HELM_NAMESPACE); \
    n=$$((n - 1)) ; \
	done;
