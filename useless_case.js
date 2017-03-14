var fs = require('fs');


string = fs.readFileSync("testResults", 'utf8');
obj = JSON.parse(string);

loopCount = obj.loopCount;

usefulTest = [];
uselessTest = [];


for(var name in obj)
{
	if(name == 'loopCount')
		continue;

	if(obj.name.success == loopCount || obj.name.failure == loopCount)
		uselessTest.push(name);
	else
		usefulTest.push(name);


}


console.log('***************************************************');
console.log('*******************TEST CASE REPORT***************');
console.log('***************************************************');

console.log("Useless Test Cases - Count: ", uselessTest.length);

for(i=0; i<uselessTest.length; i++)
{
	console.log("ClassName:TestName - ", uselessTest[i]);
}



console.log("Useful Test Cases - Count: ", usefulTest.length);

for(i=0; i<usefulTest.length; i++)
{
	console.log("ClassName:TestName - ", usefulTest[i]);
}


