var fs = require('fs'),
    parser = require('xml2json'),
    child  = require('child_process'),
    Random = require('random-js'),
    faker = require("faker");

var deasync = require('deasync');
var cp = require('child_process');
var exec = deasync(cp.exec);
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





String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

var fuzzer = 
{
    random : new Random(Random.engines.mt19937().seed(0)),
    
    seed: function (kernel)
    {
        fuzzer.random = new Random(Random.engines.mt19937().seed(kernel));
    },

    mutate:
    {
        string: function(val)
        {
            // MUTATE IMPLEMENTATION HERE


            var array = val.split(' ');

            for(i=0; i< array.length; i++)
            {
                if(array[i].indexOf('"') != -1)
                {
                    var fIndex = array[i].indexOf('"');
                    if(array[i].indexOf('"', fIndex+1) != -1)
                    {
                        sIndex = array[i].indexOf('"', fIndex+1);
                        array[i] = array[i].substring(0,fIndex+1)+faker.random.word()+array[i].substring(sIndex);
                    }
                }
            }

            var mergedCode = array.join(' ');


            array = mergedCode.split('');

            for(i=0; i<array.length; i++)
            {
                if(array[i] == '<' && array[i-1] == ' ')
                {
                    array[i] = '>';
                }
            }

            mergedCode =  array.join('');

            return mergedCode;
        }
    }
};

fuzzer.seed(10);

function mutateFile(filename)
{
    console.log("Mutating File", filename);
    var fileContent = fs.readFileSync(filename,'utf-8');
    //var markDown = fs.readFileSync('simple.md','utf-8');

    var mutuatedString = fuzzer.mutate.string(fileContent);
    console.log("Mutated String: ", mutuatedString);

    return mutuatedString;
}

function mutationTesting()
{
    var markDown = fs.readFileSync('test.md','utf-8');
    //var markDown = fs.readFileSync('simple.md','utf-8');

    var mutuatedString = fuzzer.mutate.string(markDown);

    console.log("Mutated String: ", mutuatedString);
      
}


function getRandomArbitrary(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

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



mutateAFile = function() {
    filelist = [];

    filelist = walkSync(__dirname+'/src/main/edu/ncsu/csc/itrust',filelist);

    //fileIndex = getRandomArbitrary(0,filelist.length);

    fileIndex = 82;

    console.log("FileIndex: ", fileIndex);

    mutatedString = mutateFile(filelist[fileIndex]);

    console.log("FileName: ", filelist[fileIndex]);
    console.log("Mutated String". mutatedString);

    fs.writeFileSync(filelist[fileIndex], mutatedString, 'utf8');
};




//mutationTesting();

//mutationTesting();

//test('markedMutation', function(t) {
//
//});


if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}
















testResults = {};


for(k=0; k<1; k++)
{
   try{

        mutateAFile();
        console.log("Before Exec Sync");
        try{
            exec('mvn test');    
        }
        catch(e)
        {
            console.log(e);
        }
        
        console.log("After Exec Sync");

    list = [];

    filelist = [];

    filelist = walkSync(__dirname+'/target/surefire-reports',filelist);

    console.log("FileList: ", filelist);

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

    var s = JSON.stringify(testResults);
    fs.writeFileSync("testResults", testResults, 'utf8');

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
