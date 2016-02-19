/*
 * Sample of option_parser.js
 *
 * _ is a global object defined by underscore.js.
 *
 */



setOptionParser(function(csvString) {
    var lines       = csvString.split(/\n/);

    var tmp         = lines[0].split(','),
        departments = Number(tmp[0]),
        units       = Number(tmp[1]);

    var options = {
                reservedResidents: {},
                upperLimits: {}
            };

    _.each(lines.slice(1, departments + 1), function(line) {
        var tmp               = line.split(','),
            departmentName    = tmp[0],
            reservedResidents = tmp.slice(1,units + 1),
            upperLimits       = tmp.slice(units + 1, 2 * units + 1);

        options.reservedResidents[departmentName] =
            _.map(reservedResidents, function(str) {
                return Number(str);
            });

        options.upperLimits[departmentName] =
            _.map(upperLimits, function(str) {
                return Number(str);
            });
    });

    return options;
});