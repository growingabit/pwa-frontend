#!/bin/bash

gsutil -m rm -R gs://abc-growbit-xyz-backend/static
gsutil -m rm gs://abc-growbit-xyz-backend/index.html

gsutil -m cp -R . gs://abc-growbit-xyz-backend/

gsutil rm gs://abc-growbit-xyz-backend/deploy.sh

gsutil -m acl ch -r -u AllUsers:R gs://abc-growbit-xyz-backend

gsutil web set -m index.html -e index.html gs://abc-growbit-xyz-backend

gcloud compute url-maps invalidate-cdn-cache growingabit-io --path "/*"
