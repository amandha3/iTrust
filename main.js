var fs = require('fs'),
    parser = require('xml2json'),
    child  = require('child_process'); 
    fuzzing = require("./fuzzing.js");
//var parser = new xml2js.Parser();


String.prototype.endsWith = function(suffix) {
	return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

var walkSync = function(dir, filelist) {
            var path = path || require('path');
            var fs = fs || require('fs'),
                files = fs.readdirSync(dir);
            filelist = filelist || [];
            files.forEach(function(file) {
                if (fs.statSync(path.join(dir, file)).isDirectory()) {
                    filelist = walkSync(path.join(dir, file), filelist);
                }
                else {
                    filelist.push(path.join(dir, file));
                }
            });
            return filelist;
        };

function compare(a,b)
            {
                if(!a.failed && b.failed)
                {
                    return 1;
                }
                else if(a.failed && !b.failed)
                {
                    return -1;
                }
                else
                    return a.time-b.time;
                }


testResults = {};


for(k=0; k<2; k++)
{
   try{

        fuzzing.mutateAFile();
        child.execSync('mvn test');

    list = [];

    filelist = [];

    filelist = walkSync(__dirname+'/target/surefire-reports',filelist);


    for( i=0; i < filelist.length; i++)
    {   
    //console.log("i: " + filelist[i])
        var filename = filelist[i];
        if(filename.endsWith('.xml'))
        {

           console.log("Reading File: ", filename);
           data = fs.readFileSync(filename).toString();
           console.log("Reading File Content: ", data);
           
           var options = {
                object: true,
                reversible: false,
                coerce: false,
                sanitize: true,
                trim: true,
                arrayNotation: false,
                alternateTextNode: false
            };

            result = parser.toJson(data, options);
           console.log("Reading File Content Parsed: ", result);
                

                for(key in result)
                {
                    console.log("Key: ", result[key]);
                }
                //console.log(result.testsuite.testcase[0]);
                // Print out everything
                //console.dir(JSON.stringify(result,null, 3));

                

                for(var testCase in result.testsuite.testcase)
                {
                    var t = {};
                    //console.log(result.testsuite.testcase[testCase]);
                    t.classname = result.testsuite.testcase[testCase].classname;
                    t.testname = result.testsuite.testcase[testCase].name;
                    t.failed = false;;
                    t.time = parseFloat(result.testsuite.testcase[testCase].time);
                    if(result.testsuite.testcase[testCase].hasOwnProperty("failure"))
                    {
                        console.log("Failed Test Detected:", result.testsuite.testcase[testCase].name, result.testsuite.testcase[testCase].classname);
                        t.failed = true;
                        //map.set();.

                    }
                    //map.set(testCase.)
            //console.log("Pushing to List: ", t);
                    list.push(t);
                    var keyName = t.classname+":"+t.testname;
                    if(keyName in testResults)
                    {
                        if(t.failed)
                            testResults[keyName].failure++;
                        else
                            testResults[keyName].success++;
                    }
                    else
                    {

                        var temp = {
                              success: 0,
                              failure: 0,
                            };

                        testResults[keyName] = temp;

                        if(t.failed)
                            testResults[keyName].failure++;
                        else
                            testResults[keyName].success++;
                    }
                    console.log("Inner: ", Date.now());
            //console.log("List length: ", list.length);
                }

        }
    }


    console.log("Comparing:");

    list.sort(compare);

    console.log("Inner: ", Date.now());
    console.log('Done');

    console.log("List: ", list.length); 

     }
    catch(e)
    {
        console.log(e);
    }
}


console.log("Dict is: ", testResults);
