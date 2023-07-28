# Misc
.DEFAULT_GOAL = help
.PHONY        = help build release

help: ## Outputs this help screen
	@grep -E '(^[a-zA-Z0-9_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}{printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'

build: ## Build npm package
	@npm run fix && npm run clean && npm run build

release: ## Release new patch version or pass the parameter "version" to release a given version "release version=[1.0.0|patch|minor|major]"
	@$(eval version ?= 'patch')
	@npm run fix && npm run clean && npm run build
	@npm version $(version) -m "Bump version to %s"
	@git push && git push --tags
	@npm run clean
