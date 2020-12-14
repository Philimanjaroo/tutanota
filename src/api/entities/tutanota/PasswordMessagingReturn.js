// @flow

import {create} from "../../common/EntityFunctions"
import {TypeRef} from "../../common/utils/EntityUtils";


export const PasswordMessagingReturnTypeRef: TypeRef<PasswordMessagingReturn> = new TypeRef("tutanota", "PasswordMessagingReturn")
export const _TypeModel: TypeModel = {
	"name": "PasswordMessagingReturn",
	"since": 1,
	"type": "DATA_TRANSFER_TYPE",
	"id": 313,
	"rootId": "CHR1dGFub3RhAAE5",
	"versioned": false,
	"encrypted": false,
	"values": {
		"_format": {
			"name": "_format",
			"id": 314,
			"since": 1,
			"type": "Number",
			"cardinality": "One",
			"final": false,
			"encrypted": false
		},
		"autoAuthenticationId": {
			"name": "autoAuthenticationId",
			"id": 315,
			"since": 1,
			"type": "GeneratedId",
			"cardinality": "One",
			"final": false,
			"encrypted": false
		}
	},
	"associations": {},
	"app": "tutanota",
	"version": "43"
}

export function createPasswordMessagingReturn(values?: $Shape<$Exact<PasswordMessagingReturn>>): PasswordMessagingReturn {
	return Object.assign(create(_TypeModel, PasswordMessagingReturnTypeRef), values)
}

export type PasswordMessagingReturn = {
	_type: TypeRef<PasswordMessagingReturn>;

	_format: NumberString;
	autoAuthenticationId: Id;
}