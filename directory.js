var config = require('config');
var XLSX = require('xlsx');
var jsonfile = require('jsonfile');
var filename = config.filename;
var workbook = XLSX.readFile(filename);

var first_sheet_name = workbook.SheetNames[0];
var worksheet = workbook.Sheets[first_sheet_name];
var data = XLSX.utils.sheet_to_json(worksheet);
var members = [];
data.forEach(function(item){
	if(!!item.NAME){
		var member = {};
		member.ID = item['FAA ID'];
		member.Name = item['NAME'];
		member.Batch = item['ICSE BATCH']||"";
		member.Location = item['CURRENT LOCATION']||"";
		members.push(member);
	}
});
var output = {
	members: members
};
jsonfile.writeFile("directory.json", output, function (err) {
  console.error(err)
});