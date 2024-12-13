{
	"useApiMock": true,
	"apiMockConfig": {
		"globalOpen": true,
		"rules": [{
			"ruleId": "1bec602d-b5c5-44f4-9462-f9ff49710020",
			"ruleName": "api",
			"apiName": "request",
			"enable": true,
			"verifyFail": false,
			"filterList": [{
				"propName": "url",
				"propRegString": "login",
				"filterId": "bd9fdf86-002d-4158-80fe-95983b09081d",
				"matchType": "regExp"
			}],
			"returnConfig": {
				"returnType": "succ",
				"generateType": "manual",
				"manual": {
					"succ": {
						"resStr": "{\n  \"data\": {\n    \"message\": \"OK\",\n    \"user_id\": \"1\",\n    \"nick_name\": \"香了个香\",\n    \"avatar\": \"\",\n    \"family_info\": {\n      \"members\": [],\n      \"footprints_number\": 10,\n      \"likes_numer\": 100\n    },\n    \"friends_info\": {}\n  },\n  \"statusCode\": \"200\",\n  \"header\": \"\"\n}"
					},
					"fail": {
						"resStr": "{\n  \"errMsg\": \"request:fail 填写错误信息\"\n}"
					}
				},
				"template": {
					"succ": {
						"templateStr": "{\n  \"data\": \"\",\n  \"statusCode\": \"\",\n  \"header\": \"\"\n}"
					},
					"fail": {
						"templateStr": "{\n  \"errMsg\": \"request:fail 填写错误信息\"\n}"
					}
				}
			}
		}]
	}
}
