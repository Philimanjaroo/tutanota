//@flow
import {
	base64ToBase64Url,
	base64ToUint8Array,
	base64UrlToBase64,
	stringToUtf8Uint8Array,
	uint8ArrayToBase64,
	utf8Uint8ArrayToString
} from "./Encoding"

/**
 * the maximum ID for elements stored on the server (number with the length of 10 bytes) => 2^80 - 1
 */
export const GENERATED_MAX_ID = "zzzzzzzzzzzz"/**
 *
 */
/**
 * The minimum ID for elements with generated id stored on the server
 */
export const GENERATED_MIN_ID = "------------"
/**
 * The byte length of a generated id
 */
export const GENERATED_ID_BYTES_LENGTH = 9
/**
 * The minimum ID for elements with custom id stored on the server
 */
export const CUSTOM_MIN_ID = ""
export const RANGE_ITEM_LIMIT = 1000
export const LOAD_MULTIPLE_LIMIT = 100
export const READ_ONLY_HEADER = "read-only"

/**
 * Attention: TypeRef must be defined as class and not as Flow type because object types use structural typing and TypeRef does not
 * reference T. See https://github.com/facebook/flow/issues/3348
 * T should be bound to entities but we have no type to define them yet.
 */
export class TypeRef<T> {
	+app: string;
	+type: string;

	constructor(app: string, type: string) {
		this.app = app
		this.type = type
		Object.freeze(this)
	}
}

export function isSameTypeRefByAttr(typeRef: TypeRef<any>, app: string, type: string): boolean {
	return typeRef.app === app && typeRef.type === type
}

export function isSameTypeRef(typeRef1: TypeRef<any>, typeRef2: TypeRef<any>): boolean {
	return isSameTypeRefByAttr(typeRef1, typeRef2.app, typeRef2.type)
}

/**
 * Tests if one id is bigger than another.
 * @param firstId The element id that is tested if it is bigger.
 * @param secondId The element id that is tested against.
 * @return True if firstId is bigger than secondId, false otherwise.
 */
export function firstBiggerThanSecond(firstId: Id, secondId: Id): boolean {
	// if the number of digits is bigger, then the id is bigger, otherwise we can use the lexicographical comparison
	if (firstId.length > secondId.length) {
		return true;
	} else if (secondId.length > firstId.length) {
		return false;
	} else {
		return firstId > secondId;
	}
}

export function compareNewestFirst(id1: Id | IdTuple, id2: Id | IdTuple): number {
	let firstId = (id1 instanceof Array) ? id1[1] : id1
	let secondId = (id2 instanceof Array) ? id2[1] : id2
	if (firstId === secondId) {
		return 0
	} else {
		return firstBiggerThanSecond(firstId, secondId) ? -1 : 1
	}
}

export function compareOldestFirst(id1: Id | IdTuple, id2: Id | IdTuple): number {
	let firstId = (id1 instanceof Array) ? id1[1] : id1
	let secondId = (id2 instanceof Array) ? id2[1] : id2
	if (firstId === secondId) {
		return 0
	} else {
		return firstBiggerThanSecond(firstId, secondId) ? 1 : -1
	}
}

export function sortCompareByReverseId<T: ListElement>(entity1: T, entity2: T): number {
	return compareNewestFirst(getElementId(entity1), getElementId(entity2))
}

export function sortCompareById<T: ListElement>(entity1: T, entity2: T): number {
	return compareOldestFirst(getElementId(entity1), getElementId(entity2))
}

/**
 * Compares the ids of two elements.
 * @pre Both entities are either ElementTypes or ListElementTypes
 * @param id1
 * @param id2
 * @returns True if the ids are the same, false otherwise
 */
export function isSameId(id1: Id | IdTuple, id2: Id | IdTuple): boolean {
	if (id1 instanceof Array && id2 instanceof Array) {
		return id1[0] === id2[0] && id1[1] === id2[1]
	} else {
		return (id1: any) === (id2: any)
	}
}

export function containsId(ids: Array<Id | IdTuple>, id: Id | IdTuple): boolean {
	return ids.find(idInArray => isSameId(idInArray, id)) != null
}

export type Element = {
	_id: Id
}
export type ListElement = {
	_id: IdTuple
}

export function getEtId(entity: Element): Id {
	return entity._id
}

export function getLetId(entity: ListElement): IdTuple {
	if (typeof entity._id === "undefined") {
		throw new Error("listId is not defined for " + (typeof (entity: any)._type
		=== 'undefined'
			? JSON.stringify(entity)
			: (entity: any)))
	}
	return entity._id
}

export function getElementId(entity: ListElement): Id {
	return elementIdPart(getLetId(entity))
}

export function getListId(entity: ListElement): Id {
	return listIdPart(getLetId(entity))
}

export function listIdPart(id: IdTuple): Id {
	return id[0]
}

export function elementIdPart(id: IdTuple): Id {
	return id[1]
}

/**
 * Converts a string to a custom id. Attention: the custom id must be intended to be derived from a string.
 */
export function stringToCustomId(string: string): string {
	return uint8arrayToCustomId(stringToUtf8Uint8Array(string))
}

export function uint8arrayToCustomId(array: Uint8Array): string {
	return base64ToBase64Url(uint8ArrayToBase64(array))
}

/**
 * Converts a custom id to a string. Attention: the custom id must be intended to be derived from a string.
 */
export function customIdToString(customId: string): string {
	return utf8Uint8ArrayToString(base64ToUint8Array(base64UrlToBase64(customId)));
}

export function readOnlyHeaders(): Params {
	return {[READ_ONLY_HEADER]: "true"}
}