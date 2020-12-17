#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { CdkEksAlbStack } = require('../lib/cdk-eks-alb-stack');

const app = new cdk.App();

const _env = { account: '457175632986', region: 'ca-central-1' };
new CdkEksAlbStack(app, 'CdkEksAlbStack', { env: _env });
