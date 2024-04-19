const messages = {
	// Common
	items_deleted: "Items deleted successfully!",

	// Country
	country_added: "Country has been added successfully!",
	country_updated: "Country has been updated successfully!",
	country_deleted: "Country deleted successfully!",

	// Pipe network types
	pipe_network_types_added: "Pipe network types has been added successfully!",
	pipe_network_types_updated: "Pipe network types has been updated successfully!",
	pipe_network_types_deleted: "Pipe network deleted successfully!",

	// Common product field
	common_product_field_added: "Common product field has been added successfully!",
	common_product_field_updated: "Common product field has been updated successfully!",
	common_product_field_deleted: "Common product field deleted successfully!",
};

const errorMessages = {
	// Common
	invalid_ids: "Invalid or empty IDs provided.",
	cannot_find_data_with_id: (id) => `Cannot find data with the ID: ${id}.`,
	no_data_within_ids: "No item data found with the provided IDs.",

	// Country
	country_exists: "Country already exists.",
	country_id_not_found: (id) => `Cannot find country with the ID: ${id}.`,
	country_already_exists: "Country already exists with same name and country code.",

	// Pipe network types
	pipe_network_types_exists: "Pipe network types already exists.",
	pipe_network_types_id_not_found: (id) => `Cannot find pipe network types with the ID: ${id}.`,
	pipe_network_types_already_exists: "Pipe network types already exists with same name and code.",

	// Common product field
	common_product_field_exists: "Common product field already exists.",
	common_product_field_id_not_found: (id) => `Cannot find common product field with the ID: ${id}.`,
	common_product_field_already_exists: "Common product field already exists.",
};

module.exports = { messages, errorMessages };
