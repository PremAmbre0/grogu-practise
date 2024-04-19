const Joi = require("joi");
const { hasValue, isValidObjectId, hasLength, hasTextLength } = require("./condition");
const moment = require("moment");
const { URL } = require("url");

const validateModel = async ({ id, name, model }) => {
	if (!hasValue(id)) {
		return {
			failed: true,
			code: 501,
			res: {
				error: `Please provide valid ${name} id.`,
			},
		};
	}
	if (!isValidObjectId(id)) {
		return {
			failed: true,
			code: 400,
			res: {
				message: `Cannot find ${name} with the id: ${id}.`,
			},
		};
	}
	const isExist = await model.findOne({ _id: id });
	if (!isExist) {
		return {
			failed: true,
			code: 501,
			res: {
				error: `Cannot find ${name} with the id: ${id}.`,
			},
		};
	}
	return { failed: false, data: isExist };
};

function convertToCamelCase(text) {
	const trimmedString = text.trim().toLowerCase();
	const snakeCaseString = trimmedString.replace(/\s+/g, "_");
	const camelCaseString = snakeCaseString.replace(/_([a-z])/g, (_, match) => match.toUpperCase());
	return camelCaseString;
}
const externalFieldTypes = {
	Date: "string",
	Text: "string",
	Number: "number",
	Boolean: "boolean",
	Image: "string",
};
const validateExternalFields = (fields, isUpdate) => {
	let externalFields = {};
	if (!hasLength(fields)) return externalFields;
	fields.map((item) => {
		const field = item.key;
		let type = externalFieldTypes[item.type];
		const required = isUpdate ? false : item.isMandatory;
		if (item.type === "Image") {
			externalFields[field] = required ? Joi.string().uri().required() : Joi.string().uri().allow(null);
			return;
		}
		externalFields[field] = required ? Joi?.[type]?.().required() : Joi[type]().allow(null);
		return;
	});
	return externalFields;
};

const getExternalFields = async (columns, body) => {
	let data = {};
	columns.map((item) => {
		const field = item.key;
		data[field] = body?.[field] ?? null;
	});
	return data;
};
const getExternalFieldsImports = async (columns, body) => {
	let data = {};
	columns.map((item) => {
		const field = item.description;
		data[item.key] = body?.[field] ?? null;
	});
	return data;
};
const getExternalData = (columns, body) => {
	let data = {};
	columns.map((item) => {
		const field = item.key;
		data[field] = body?.[field] ?? null;
	});
	return data;
};
const makeTitleCase = (string) => {
	const text = string.replace(/([A-Z])/g, " $1");
	return text.charAt(0).toUpperCase() + text.slice(1);
};

const getABCOuterDiameter = (body, number, isUpdate = false) => {
	let abcOuterDiameter = {};
	if (isUpdate && number == 0) {
		abcOuterDiameter = {
			AOuterDiameter: null,
			BOuterDiameter: null,
			COuterDiameter: null,
			AMasterPipe: null,
			BMasterPipe: null,
			CMasterPipe: null,
		};
	}
	if (number == 1) {
		if (isUpdate) {
			abcOuterDiameter = {
				AOuterDiameter: body.AOuterDiameter,
				AMasterPipe: body?.AMasterPipe,
				BOuterDiameter: null,
				COuterDiameter: null,
				BMasterPipe: null,
				CMasterPipe: null,
			};
		} else {
			abcOuterDiameter = {
				AOuterDiameter: body.AOuterDiameter,
				AMasterPipe: body?.AMasterPipe,
			};
		}
	}
	if (number == 2) {
		if (isUpdate) {
			abcOuterDiameter = {
				AOuterDiameter: body.AOuterDiameter,
				BOuterDiameter: body.BOuterDiameter,
				AMasterPipe: body.AMasterPipe,
				BMasterPipe: body.BMasterPipe,
				COuterDiameter: null,
				CMasterPipe: null,
			};
		} else {
			abcOuterDiameter = {
				AOuterDiameter: body.AOuterDiameter,
				BOuterDiameter: body.BOuterDiameter,
				AMasterPipe: body.AMasterPipe,
				BMasterPipe: body.BMasterPipe,
			};
		}
	}
	if (number == 3) {
		abcOuterDiameter = {
			AOuterDiameter: body.AOuterDiameter,
			BOuterDiameter: body.BOuterDiameter,
			COuterDiameter: body.COuterDiameter,
			AMasterPipe: body.AMasterPipe,
			BMasterPipe: body.BMasterPipe,
			CMasterPipe: body.CMasterPipe,
		};
	}
	return abcOuterDiameter;
};
const getABCOuterDiameter2 = (body, number, isUpdate = false) => {
	let abcOuterDiameter = {};
	if (isUpdate && number == 0) {
		abcOuterDiameter = {
			AOuterDiameter: null,
			BOuterDiameter: null,
			COuterDiameter: null,
			AMasterPipe: null,
			BMasterPipe: null,
			CMasterPipe: null,
		};
	}
	if (number == 1) {
		if (isUpdate) {
			abcOuterDiameter = {
				AOuterDiameter: body.AOuterDiameter,
				AMasterPipe: body?.AMasterPipe?.toString?.(),
				BOuterDiameter: null,
				COuterDiameter: null,
				BMasterPipe: null,
				CMasterPipe: null,
			};
		} else {
			abcOuterDiameter = {
				AOuterDiameter: body.AOuterDiameter,
				AMasterPipe: body?.AMasterPipe?.toString?.(),
			};
		}
	}
	if (number == 2) {
		if (isUpdate) {
			abcOuterDiameter = {
				AOuterDiameter: body.AOuterDiameter,
				BOuterDiameter: body.BOuterDiameter,
				AMasterPipe: body.AMasterPipe?.toString?.(),
				BMasterPipe: body.BMasterPipe?.toString?.(),
				COuterDiameter: null,
				CMasterPipe: null,
			};
		} else {
			abcOuterDiameter = {
				AOuterDiameter: body.AOuterDiameter,
				BOuterDiameter: body.BOuterDiameter,
				AMasterPipe: body.AMasterPipe?.toString?.(),
				BMasterPipe: body.BMasterPipe?.toString?.(),
			};
		}
	}
	if (number == 3) {
		abcOuterDiameter = {
			AOuterDiameter: body.AOuterDiameter,
			BOuterDiameter: body.BOuterDiameter,
			COuterDiameter: body.COuterDiameter,
			AMasterPipe: body.AMasterPipe?.toString?.(),
			BMasterPipe: body.BMasterPipe?.toString?.(),
			CMasterPipe: body.CMasterPipe?.toString?.(),
		};
	}
	if (!hasTextLength(abcOuterDiameter?.AOuterDiameter)) delete abcOuterDiameter?.AOuterDiameter;
	if (!hasTextLength(abcOuterDiameter?.BOuterDiameter)) delete abcOuterDiameter?.BOuterDiameter;
	if (!hasTextLength(abcOuterDiameter?.COuterDiameter)) delete abcOuterDiameter?.COuterDiameter;
	if (!hasTextLength(abcOuterDiameter?.AMasterPipe)) delete abcOuterDiameter?.AMasterPipe;
	if (!hasTextLength(abcOuterDiameter?.BMasterPipe)) delete abcOuterDiameter?.BMasterPipe;
	if (!hasTextLength(abcOuterDiameter?.CMasterPipe)) delete abcOuterDiameter?.CMasterPipe;
	return abcOuterDiameter;
};
function getMeasurementSystem(value) {
	const metricUnits = ["mm"];
	const imperialUnits = ["in"];

	if (metricUnits.includes(value.toLowerCase())) {
		return "metric";
	} else if (imperialUnits.includes(value.toLowerCase())) {
		return "imperial";
	} else {
		return "unknown";
	}
}
const getSizeDisplayText = (masterPipe, unit) => {
	if (!masterPipe) return "";
	if (!unit) return masterPipe?.imperialDisplayText ?? "";
	const unitType = getMeasurementSystem(unit);
	if (unitType === "imperial") return masterPipe?.imperialDisplayText ?? "";
	if (unitType === "metric") return masterPipe?.metricDisplayText ?? "";
	if (unitType === "unknown") return masterPipe?.imperialDisplayText ?? "";
};
const getSizeDisplayKey = (unit) => {
	if (!unit) return "unknown";
	const unitType = getMeasurementSystem(unit);
	if (unitType === "imperial") return "imperialDisplayText";
	if (unitType === "metric") return "metricDisplayText";
	if (unitType === "unknown") return "unknown";
};

function transformKeysArray(arrayOfObjects, arr1, arr2) {
	return arrayOfObjects.map((obj) => {
		const result = {};
		const otherFields = {};

		// Iterate through all keys in the object
		for (const key in obj) {
			if (arr1.includes(key)) {
				const index = arr1.indexOf(key);
				result[arr2[index]] = obj[key];
			} else {
				// Include additional fields in the "otherFields" object
				otherFields[key] = obj[key];
			}
		}

		// Include the "otherFields" object if it's not empty
		if (Object.keys(otherFields).length > 0) {
			result.otherFields = otherFields;
		}

		return result;
	});
}

const copyFile = (tempFile, file) =>
	new Promise((resolve, reject) => {
		tempFile.mv(file, function (err) {
			if (err) {
				console.error(err);
				return reject("Could not copy file");
			}
			return resolve(true);
		});
	});

function isValidDateTime(dateTimeString) {
	const momentObj = moment(dateTimeString, "DD-MM-YYYY");
	if (!momentObj.isValid() && momentObj._i) {
		const autoParsedMoment = moment(momentObj._i);
		return autoParsedMoment.isValid();
	}
	return momentObj.isValid();
}

function isBoolean(value) {
	if (typeof value === "boolean") {
		return true;
	}

	if (typeof value !== "boolean") {
		const lowerCaseValue = value?.toString?.().toLowerCase();
		return lowerCaseValue === "true" || lowerCaseValue === "false";
	}

	return false;
}
function isNumber(value) {
	return typeof value === "number" || (typeof value === "string" && !isNaN(Number(value)));
}

function isValidUrl(value) {
	try {
		new URL(value);
		return true;
	} catch (err) {
		return false;
	}
}

const ValidateExternalFieldItem = (item, value) => {
	const { description, key, type, isMandatory } = item;
	if (isMandatory && !value) return { success: false, message: `${description} is required field.` };
	let fieldValue = value;
	if (value) {
		if (type === "Boolean") {
			if (!isBoolean(value)) {
				return { success: false, message: `${description} must be a boolean.` };
			}
			fieldValue = value.trim().toLowerCase() == "true";
		}
		if (type === "Text") {
			if (typeof value !== "string") {
				return { success: false, message: `${description} must be a string.` };
			}
			fieldValue = value;
		}
		if (type === "Date") {
			if (!isValidDateTime(value)) {
				return {
					success: false,
					message: `${description} is not a valid date and must be in a DD-MM-YYYY format`,
				};
			}
			const date = moment(value, "DD-MM-YYYY");
			fieldValue = date.format("YYYY-MM-DD");
		}
		if (type === "Number") {
			if (!isNumber(value)) {
				return { success: false, message: `${description} must be a number.` };
			}
			fieldValue = Number(value);
		}
		if (type === "Image" || type === "Url") {
			if (!isValidUrl(value)) {
				return { success: false, message: `${description} must be a valid url` };
			}
			fieldValue = value;
		}
		return { success: true, fieldValue };
	}
	return { success: true, fieldValue };
};

const formatDate = function (data, value) {
	const date = moment(value, "DD-MM-YYYY");
	if (!date.isValid()) {
		data.success = false;
		data.message = `Date format is not valid, must be in DD-MM-YYYY format`;
		return value;
	}
	value = date.format("YYYY-MM-DD");
	return value;
};

module.exports = {
	isNumber,
	getABCOuterDiameter2,
	ValidateExternalFieldItem,
	externalFieldTypes,
	isValidDateTime,
	isBoolean,
	copyFile,
	transformKeysArray,
	validateModel,
	convertToCamelCase,
	validateExternalFields,
	getExternalFields,
	getExternalFieldsImports,
	getExternalData,
	getABCOuterDiameter,
	makeTitleCase,
	getMeasurementSystem,
	getSizeDisplayKey,
	getSizeDisplayText,
	formatDate,
};
