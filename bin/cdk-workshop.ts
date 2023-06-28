#!/usr/bin/env node
// This is the entrypoint of the CDK application
// It will load the stack defined in lib/cdk-workshop-stack.ts

import * as cdk from "aws-cdk-lib";
import { CdkWorkshopStack } from "../lib/cdk-workshop-stack";

const app = new cdk.App();
new CdkWorkshopStack(app, "CdkWorkshopStack");
