# Misc
.DEFAULT_GOAL = help
.PHONY        = help build release-patch release-minor release-major

help: ## Outputs this help screen
	@grep -E '(^[a-zA-Z0-9_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}{printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'

build: ## Build npm package
	@npm run fix && npm run clean && npm run build

release-patch: ## Release new patch version
	@npm run fix && npm run clean && npm run build
	@npm version patch -m "Bump version to %s"

release-minor: ## Release new minor version
	@npm run fix && npm run clean && npm run build
	@npm version minor -m "Bump version to %s"

release-major: ## Release new major version
	@npm run fix && npm run clean && npm run build
	@npm version major -m "Bump version to %s"
