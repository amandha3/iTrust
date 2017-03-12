var fs = require('fs'),
    xml2js = require('xml2js'),
    child  = require('child_process'); 
var parser = new xml2js.Parser();
var HashMap = require('hashmap');

var testReport =  '/simplecalc/target/surefire-reports/TEST-com.github.stokito.unitTestExample.calculator.CalculatorTest.xml';

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

try{
//    child.execSync('cd simplecalc; mvn test');
}
catch(e)
{
    //console.log(e);
}
    

var list = [];

filelist = []

filelist = walkSync(__dirname+'/target/surefire-reports',filelist);

for( i=0; i < filelist.length; i++)
{   
//console.log("i: " + filelist[i])
    if(filelist[i].endsWith('.xml'))
    {

        fs.readFile(filelist[i], function(err, data) {
        parser.parseString(data, function (err, result) {
            console.dir(result);
            console.log(result.testsuite.testcase[0]);
            // Print out everything
            //console.dir(JSON.stringify(result,null, 3));

            

            for(var testCase in result.testsuite.testcase)
            {
                var t = {};
                //console.log(result.testsuite.testcase[testCase]);
                t.classname = result.testsuite.testcase[testCase]['$'].classname;
                t.testname = result.testsuite.testcase[testCase]['$'].name;
                t.failed = false;;
                t.time = parseFloat(result.testsuite.testcase[testCase]['$'].time);
                if(result.testsuite.testcase[testCase].hasOwnProperty("failure"))
                {
                    console.log("Failed Test Detected:", result.testsuite.testcase[testCase]['$'].name, result.testsuite.testcase[testCase]['$'].classname);
                    t.failed = true;
                    //map.set();.

                }
                //map.set(testCase.)

                list.push(t);
            }

            
        });
        });

    }
}

list.sort(compare);


console.log('Done');

console.log(list);
