export class CustomError extends Error {
	name;
	code;
	message;

	constructor(name, code, message) {
		super(message);
		this.name = name;
		this.code = code;
		this.message = message;
	}
}
