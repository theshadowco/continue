# coding: utf-8

"""
    Continue Hub IDE API

    API for Continue IDE to fetch assistants and other related information. These endpoints are primarily used by the Continue IDE extensions for VS Code and JetBrains. 

    The version of the OpenAPI document: 1.0.0
    Generated by OpenAPI Generator (https://openapi-generator.tech)

    Do not edit the class manually.
"""  # noqa: E501


import unittest

from openapi_client.models.list_organizations200_response import ListOrganizations200Response

class TestListOrganizations200Response(unittest.TestCase):
    """ListOrganizations200Response unit test stubs"""

    def setUp(self):
        pass

    def tearDown(self):
        pass

    def make_instance(self, include_optional) -> ListOrganizations200Response:
        """Test ListOrganizations200Response
            include_optional is a boolean, when False only required
            params are included, when True both required and
            optional params are included """
        # uncomment below to create an instance of `ListOrganizations200Response`
        """
        model = ListOrganizations200Response()
        if include_optional:
            return ListOrganizations200Response(
                organizations = [
                    openapi_client.models.list_organizations_200_response_organizations_inner.listOrganizations_200_response_organizations_inner(
                        id = '', 
                        name = '', 
                        icon_url = '', 
                        slug = '', )
                    ]
            )
        else:
            return ListOrganizations200Response(
                organizations = [
                    openapi_client.models.list_organizations_200_response_organizations_inner.listOrganizations_200_response_organizations_inner(
                        id = '', 
                        name = '', 
                        icon_url = '', 
                        slug = '', )
                    ],
        )
        """

    def testListOrganizations200Response(self):
        """Test ListOrganizations200Response"""
        # inst_req_only = self.make_instance(include_optional=False)
        # inst_req_and_optional = self.make_instance(include_optional=True)

if __name__ == '__main__':
    unittest.main()
