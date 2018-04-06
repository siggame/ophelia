#!/bin/bash

DEPLOY_NAME=test-server
ENV_NAME=cloud-env

SCRIPT_PATH=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

helm delete --purge $DEPLOY_NAME
kubectl delete configmap $ENV_NAME
kubectl create configmap $ENV_NAME --from-env-file="$SCRIPT_PATH/.env"
helm install "$SCRIPT_PATH/helm" --name $DEPLOY_NAME