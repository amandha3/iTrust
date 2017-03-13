var test = require('tap').test,
    //fuzzer = require('fuzzer'),
    Random = require('random-js')
    fs = require('fs'),
    faker = require("faker"),
    //stackTrace = require('stack-trace')
    stackTrace = require('stacktrace-parser')
    ;


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

            val = val.replace('<','>');

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
                if(array[i] == '<')
                    array[i] = '>';
            }

            mergedCode =  array.join('');

            return mergedCode;
        }
    }
};

fuzzer.seed(10);

var failedTests = [];
var reducedTests = [];
var passedTests = 0;

function mutationTesting()
{
    var markDown = fs.readFileSync('test.md','utf-8');
    //var markDown = fs.readFileSync('simple.md','utf-8');

    var mutuatedString = fuzzer.mutate.string(markDown);

    console.log("Mutated String: ", mutuatedString);
      
}

mutationTesting();

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