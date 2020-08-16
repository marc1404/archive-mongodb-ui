module.exports = function(app){
	app.get("/api/mongodb/databases", require("./databases"));
	app.get("/api/mongodb/database/:database/collections", require("./collections"));
	app.get("/api/mongodb/database/:database/collection/:collection/documents", require("./documents"));
};