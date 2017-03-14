var test = require('tap').test,
    //fuzzer = require('fuzzer'),
    Random = require('random-js')
    fs = require('fs'),
    faker = require("faker"),
    //stackTrace = require('stack-trace')
    stackTrace = require('stacktrace-parser')
    ;


var exports = module.exports = {};



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



exports.mutateAFile = function() {
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