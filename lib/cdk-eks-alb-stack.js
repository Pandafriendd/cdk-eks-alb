const cdk = require('@aws-cdk/core');

const { Stack, Tags } = require('@aws-cdk/core');
const ec2 = require('@aws-cdk/aws-ec2');
const { Vpc, Subnet } = require('@aws-cdk/aws-ec2');
const eks = require('@aws-cdk/aws-eks');
const { Cluster, KubernetesManifest, OpenIdConnectProvider, ServiceAccount } = require('@aws-cdk/aws-eks');
const { Effect, ManagedPolicy, PolicyStatement, Role, ServicePrincipal, Policy } = require('@aws-cdk/aws-iam');
const efs = require('@aws-cdk/aws-efs');

const yaml = require("js-yaml");
const fs = require("fs");

class CdkEksAlbStack extends cdk.Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const cluster = new Cluster(this, 'cdp-k8s', {
      version: eks.KubernetesVersion.V1_18
    });

    const certManangerYaml = yaml.safeLoadAll(fs.readFileSync("./k8s-manifest/cert-manager.yaml").toString());
    //const certManangerYaml = loadManifestYaml('kubernetes-manifests/cert-manager/cert-manager.yaml');
    const certManager = new KubernetesManifest(this, 'certManager', {
      cluster: cluster,
      manifest: certManangerYaml
    });


    const manifest2 = [
      {
        apiVersion: 'v1',
        kind: 'Service',
        metadata: {
          name: 'hello-kubernetes',
        },
        spec: {
          type: 'LoadBalancer',
          ports: [
            { port: 80, targetPort: 8080 },
          ],
          selector: {
            app: 'hello-kubernetes',
          },
        },
      },
      {
        apiVersion: 'apps/v1',
        kind: 'Deployment',
        metadata: {
          name: 'hello-kubernetes',
        },
        spec: {
          replicas: 2,
          selector: {
            matchLabels: {
              app: 'hello-kubernetes',
            },
          },
          template: {
            metadata: {
              labels: {
                app: 'hello-kubernetes',
              },
            },
            spec: {
              containers: [
                {
                  name: 'hello-kubernetes',
                  image: 'paulbouwer/hello-kubernetes:1.5',
                  ports: [
                    { containerPort: 8080 },
                  ],
                },
              ],
            },
          },
        },
      },
    ];

    new KubernetesManifest(this, 'testManifest', {
      cluster,
      manifest2,
    });




  }
}

module.exports = { CdkEksAlbStack }
