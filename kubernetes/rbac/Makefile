
COMPONENTS=clusterrolebindings rolebindings serviceaccounts
DESTROY_TARGETS= $(addsuffix -delete, $(COMPONENTS))

.PHONY: $(DESTROY_TARGETS) $(COMPONENTS) install delete

install: $(COMPONENTS)

$(COMPONENTS):
	$(MAKE) install -C $@

$(DESTROY_TARGETS):
	$(MAKE) delete -C $(subst -delete, ,$@)

delete: $(DESTROY_TARGETS)
