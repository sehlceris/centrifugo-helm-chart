# aquariusconnect centrifugo helm chart

```shell
cd charts/centrifugo

kubectl create namespace centrifugo

helm upgrade --install \
centrifugo \
. \
-f values.yaml \
-f secret-values.yaml \
--namespace centrifugo
```

# Centrifugal Kubernetes Helm Charts

![Release Charts](https://github.com/centrifugal/helm-charts/workflows/Release%20Charts/badge.svg?branch=master)

The code is provided as-is with no warranties.

## Usage

[Helm](https://helm.sh) must be installed to use the charts.

Please refer to Helm's [documentation](https://helm.sh/docs/) to get started.

Once Helm is set up properly, add the repo as follows:

```
helm repo add centrifugal https://centrifugal.github.io/helm-charts
```

You can then run `helm search repo centrifugal` to see the charts.

See documentation for each specific chart:

* [Centrifugo](https://github.com/centrifugal/helm-charts/tree/master/charts/centrifugo)

## License

MIT
