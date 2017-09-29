#!/bin/bash

gsutil -m rm -R gs://abc-growbit-xyz-backend/

gsutil -m cp -R . gs://abc-growbit-xyz-backend/

gsutil acl ch -r -u AllUsers:R gs://abc-growbit-xyz-backend

gcloud compute url-maps invalidate-cdn-cache growingabit-io --path "/*"
