lint: 
	docker run --rm -t -v `pwd`/integration/:/data/integration/ auth0/marketplace-integration-tools npm run integration:lint

zip: 
	zip -r integration-log-streaming-guide.zip integration media
