var fs = require('fs'),
    parser = require('xml2json'),
    child  = require('child_process'),
    Random = require('random-js'),
    faker = require("faker");

var shell = require('shelljs');


var cp = require('child_process');
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

            lines = val.split("\n");

            for(k=0; k<lines.length; k++)
            {
                var array = lines[k].split(' ');

                for(i=0; i< array.length; i++)
                {
                    if(array[i].startsWith('"') && array[i].endsWith('"') && array[i].length > 1)
                    {
                         array[i] = '"'+ faker.random.word() +'"';
                    }
                }

                lines[k] = array.join(' ');


            }

            mergedCode = lines.join("\n");

            array = mergedCode.split('');

            for(i=0; i<array.length; i++)
            {
                if(array[i] == '<' && array[i-1] == ' ')
                {
                    array[i] = '>';
                }
            }

            mergedCode = array.join('');

                
            return mergedCode;
        }
    }
};


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

    fileIndex = getRandomArbitrary(0,filelist.length);

    //fileIndex = 82;

    console.log("FileIndex: ", fileIndex);

    mutatedString = mutateFile(filelist[fileIndex]);

    console.log("FileName: ", filelist[fileIndex]);
    console.log("Mutated String");
    console.log(mutatedString);

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


















for(k=0; k<1; k++)
{
   try{
	shell.exec('git checkout test-branch');
	for(p=0; p<10; p++)
	{
          mutateAFile();
	}
        console.log("Before Exec Sync");
        try{
	  shell.exec('git config --global user.email "fuzzer@fuzz.com"');
	  shell.exec('git add .');
	  shell.exec('git commit -m "Test Commit"');
          //shell.exec('mvn test');
	  //mvn.execute(['test'],{silent: true});    
        }
        catch(e)
        {
            console.log(e);
	    console.log("Yup! Error in MVN");
            process.exit(1);
        }
        
    console.log("After Sync"); 

     }
    catch(e)
    {
        console.log(e);
    }
}


