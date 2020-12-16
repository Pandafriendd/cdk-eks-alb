#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { CdkEksAlbStack } = require('../lib/cdk-eks-alb-stack');

const app = new cdk.App();
new CdkEksAlbStack(app, 'CdkEksAlbStack');
