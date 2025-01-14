/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const path = require('path')
const { ActionGenerator, constants, commonTemplates } = require('@adobe/generator-app-common-lib')
const { commonDependencyVersions } = constants

class CustomerProfileGenerator extends ActionGenerator {
  constructor (args, opts) {
    super(args, opts)
    this.props = {
      description: 'This is a sample action showcasing how to access an external Adobe Experience Platform: Realtime Customer Profile API',
      // eslint-disable-next-line quotes
      requiredParams: `['tenant', 'apiKey', 'entityId', 'entityIdNS']`,
      // eslint-disable-next-line quotes
      requiredHeaders: `['Authorization', 'x-gw-ims-org-id']`,
      // eslint-disable-next-line quotes
      importCode: `const { Core, CustomerProfile } = require('@adobe/aio-sdk')`,
      responseCode: `// initialize sdk
    const orgId = params.__ow_headers['x-gw-ims-org-id']
    const client = await CustomerProfile.init(params.tenant, orgId, params.apiKey, token)
    // call methods, eg getProfile
    const profile = await client.getProfile({
      entityId: params.entityId,
      entityIdNS: params.entityIdNS
    });
    const response = {
      statusCode: 200,
      body: profile
    }`
    }
  }

  async prompting () {
    this.props.actionName = await this.promptForActionName('interacts with the Adobe Experience Platform: Realtime Customer Profile', 'customer-profile')
  }

  writing () {
    this.sourceRoot(path.join(__dirname, '.'))

    this.addAction(this.props.actionName, commonTemplates['stub-action'], {
      testFile: './templates/getProfile.test.js',
      sharedLibFile: commonTemplates.utils,
      sharedLibTestFile: commonTemplates['utils.test'],
      e2eTestFile: commonTemplates['stub-action.e2e'],
      tplContext: this.props,
      dotenvStub: {
        label: 'please provide your Adobe Experience Platform Realtime Customer Profile tenant',
        vars: [
          'CUSTOMER_PROFILE_TENANT'
        ]
      },
      dependencies: {
        '@adobe/aio-sdk': commonDependencyVersions['@adobe/aio-sdk']
      },
      actionManifestConfig: {
        inputs: { LOG_LEVEL: 'debug', tenant: '$CUSTOMER_PROFILE_TENANT', apiKey: '$SERVICE_API_KEY' },
        annotations: { final: true } // makes sure loglevel cannot be overwritten by request param
      }
    })
  }
}

module.exports = CustomerProfileGenerator
