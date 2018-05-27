/**
 * xml2json.js
 */
// This code is a Simple XML to JavaScript object converter. 0/6/2017  Version 0.4.19
// https://github.com/Leonidas-from-XIV/node-xml2js
// See "node-xml2js-master" as used...
// ...in "C:\Users\Bruce\Dropbox\Project Node Console\NodejsGetInitialData"

//var xml2js = require('xml2js'); //this is done in the statement doing: parserArray.push(require('xml2js').parseString)

var parseNumbers = function (str) {
    if (!isNaN(str)) {
        str = str % 1 === 0 ? parseInt(str, 10) : parseFloat(str);
    }
    return str;
};

var parseBooleans = function (str) {
    if (/^(?:true|false)$/i.test(str)) {
        str = str.toLowerCase() === 'true';
    }
    return str;
};

var parserArray = []; //holds a parser instance for each xml file parsed to build a plan object

var xml2json = {

    buildPlanObject: function (inputXml, outputJs) {
        //console.log('xml2json buildPlanObject() is called');

        var arrayLen = parserArray.push(require('xml2js').parseString); //a new parser for each use
        return parserArray[arrayLen - 1](inputXml,
            {
                async: false,
                explicitArray: false, //an array is created only if there is more than one child node              
                normalize: false, //do not trim whitespaces inside text nodes
                valueProcessors: [parseNumbers, parseBooleans]
            },
            function (err, result) {
                if (!err) {
                    //store the master object built from xml data 
                    Object.assign(outputJs, result);
                    //} else {
                    //if (SESSION.localhost) {debugger};  //pause for developer inspection | do the error response
                };
            }
        );
    },

}
module.exports = xml2json;