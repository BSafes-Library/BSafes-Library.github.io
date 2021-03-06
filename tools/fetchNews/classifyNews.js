const {
  exec
} = require("child_process");
var fs = require('fs');
const request = require('request');
const {
  JSDOM
} = require("jsdom");
const {
  window
} = new JSDOM("");
const $ = require("jquery")(window);

var goOfficial = true;

var $allNews;
var issues = [
	{
    name: '5G',
    label: '-- [5G](/docs/issues/5g/5g/)',
    file: '../../docs/issues/5g/5g.md',
    title: '## 5G'
  },
	{
    name: 'Accident',
    label: '-- [Accident](/docs/issues/accident/accident/)',
    file: '../../docs/issues/accident/accident.md',
    title: '## Accident'
  },
	{
		name: 'APT',
		label: '-- [APT](/docs/issues/advanced-persistent-threat/advanced-persistent-threat/)',
		file: '../../docs/issues/advanced-persistent-threat/advanced-persistent-threat.md',
		title: '## Advanced Persistent Threat'
	},
	{
		name: 'Attack',
    label: '-- [Attack](/docs/issues/attack/attack/)',
    file: '../../docs/issues/attack/attack.md',
    title: '## Attack'
	},
	{
		name: 'Botnet',
    label: '-- [Botnet](/docs/issues/botnet/botnet/)',
		file: '../../docs/issues/botnet/botnet.md',
		title: '## Botnet'
	},
	{
		name: 'Business',
		label: '-- [Business](/docs/issues/business/business/)',
		file: '../../docs/issues/business/business.md',
		title: '## Business'
	},
	{
		name: 'Breach',
		label: '-- [Breach](/docs/issues/breach/breach/)',
    file: '../../docs/issues/breach/breach.md',
    title: '## Breach'
	},
	{
		name: 'Covid-19',
    label: '-- [Covid-19](/docs/issues/covid-19/covid-19/)',
    file: '../../docs/issues/covid-19/covid-19.md',
		title: '## Covid-19'
	},
	{
		name: 'Criminals',
    label: '-- [Criminals](/docs/issues/criminals/criminals/)',
    file: '../../docs/issues/criminals/criminals.md',
    title: '## Criminals'
	},
	{
		name: 'Deepfake',
		label: '-- [Deepfake](/docs/issues/deepfake/deepfake/)',
    file: '../../docs/issues/deepfake/deepfake.md',
    title: '## Deepfake'
	},
	{
		name: 'Denial Of Service',
    label: '-- [Denial Of Service](/docs/issues/denial-of-service/denial-of-service/)',
		file: '../../docs/issues/denial-of-service/denial-of-service.md',
    title: '## Denial Of Service'
	},
	{
    name: 'Disinformation',
    label: '-- [Disinformation](/docs/issues/disinformation/disinformation/)',
    file: '../../docs/issues/disinformation/disinformation.md',
    title: '## Disinformation'
  },
	{
    name: 'Education',
    label: '-- [Education](/docs/issues/education/education/)',
    file: '../../docs/issues/education/education.md',
    title: '## Education'
  },
	{
		name: 'Encryption',
		label: '-- [Encryption](/docs/issues/encryption/encryption/)',
		file: '../../docs/issues/encryption/encryption.md',
		title: '## Encryption'
	},
	{
		name: 'General',
    label: '-- [General](/docs/issues/general/general/)',
    file: '../../docs/issues/general/general.md',
    title: '## General'
	}, 
	{
		name: 'Government',
    label: '-- [Government](/docs/issues/government/government/)',
    file: '../../docs/issues/government/government.md',
    title: '## Government'
	},
	{
		name: 'Hacker',
		label: '-- [Hacker](/docs/issues/hacker/hacker/)',
		file: '../../docs/issues/hacker/hacker.md',
		title: '## Hacker'
	},
	{
		name: 'Insider Threat',
		label: '-- [Insider Threat](/docs/issues/insider-threat/insider-threat/)',
		file: '../../docs/issues/insider-threat/insider-threat.md',
		title: '## Insider Threat'
	},
	{
		name: 'IOT',
    label: '-- [IOT](/docs/issues/iot/iot/)',
    file: '../../docs/issues/iot/iot.md',
    title: '## IOT'
	},
	{
		name: 'Law Article',
    label: '-- [Law Article](/docs/laws-and-regulations/laws-and-regulations/)',
    file: '../../docs/laws-and-regulations/laws-and-regulations.md',
		title: '## Laws and Regulations'	
	},
	{
		name: 'Malware',
		label: '-- [Malware](/docs/issues/malware/malware/)',
		file: '../../docs/issues/malware/malware.md',
		title: '## Malware',
	},
	{
		name: 'Outage',
    label: '-- [Outage](/docs/issues/outage/outage/)',
    file: '../../docs/issues/outage/outage.md',
    title: '## Outage'
	},
	{
		name: 'Phishing',
		label: '-- [Phishing](/docs/issues/phishing/phishing/)',
		file: '../../docs/issues/phishing/phishing.md',
		title: '## Phishing'
	},
	{
		name: 'Policy and Law',
    label: '-- [Policy and Law](/docs/issues/policy-and-law/policy-and-law/)',
    file: '../../docs/issues/policy-and-law/policy-and-law.md',
    title: '## Policy and Law'
	},
	{
		name: 'Privacy',
		label: '-- [Privacy](/docs/issues/privacy/privacy/)',
    file: '../../docs/issues/privacy/privacy.md',
    title: '## Privacy'
	},
	{
		name: 'Quantum',
    label: '-- [Quantum](/docs/issues/quantum-computing/quantum-computing/)',
    file: '../../docs/issues/quantum-computing/quantum-computing.md',
    title: '## Quantum Computing'
	},
	{
		name: 'Ransomware',
		label: '-- [Ransomware](/docs/issues/ransomware/ransomware/)',
		file: '../../docs/issues/ransomware/ransomware.md',
		title: '## Ransomware'
	},
	{
		name: 'Skimming',
		label: '-- [Skimming](/docs/issues/skimming/skimming/)',
		file: '../../docs/issues/skimming/skimming.md',
		title: '## Skimming'
	},
	{
    name: 'Solution',
    label: '-- [Solution](/docs/issues/solution/solution/)',
    file: '../../docs/issues/solution/solution.md',
    title: '## Solution'
  },
	{
    name: 'Terrorist',
    label: '-- [Terrorist](/docs/issues/terrorist/terrorist/)',
    file: '../../docs/issues/terrorist/terrorist.md',
    title: '## Terrorist'
	},
	{
    name: 'Vulnerabilities',
		label: '-- [Vulnerabilities](/docs/issues/vulnerabilities/vulnerabilities/)',
		file: '../../docs/issues/vulnerabilities/vulnerabilities.md',
		title: '## Vulnerabilities'
	}
]

function copyIndex() {
/* Copy the original index.md to local folder */
  exec('cp ../../index.md .', (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log("Copied index.md");
    setTimeout(readOriginalFile, 100);
  });
}

copyIndex();

function readOriginalFile() {
	console.log("readOriginalFile:");
  var content = fs.readFileSync('index.md', 'utf8');
	var content = '<div>' + content + '</div>';
	var $content = $($.parseHTML(content));
	$allNews = $content.find('.code-example');

	setTimeout(classifyNews, 100);  
}

function classifyNews() {
	var issueIndex = 0;	

	function processOneIssue() {
		var thisIssue = issues[issueIndex];
		console.log("Process issue: ", thisIssue.name);
		
		var oldNews = [];
		var oldNewsBlock;

		var nameParts = thisIssue.file.split('/');
		var fileName = nameParts[nameParts.length - 1];
		var newFile = 'new_' + fileName; 

		function copyIssueFile() {
			var cmd  = 'cp ' + thisIssue.file + ' .';
	  	exec(cmd, (error, stdout, stderr) => {
    		if (error) {
      		console.log(`error: ${error.message}`);
      		return;
    		}
    		if (stderr) {
      		console.log(`stderr: ${stderr}`);
      		return;
    		}
    		console.log("Copied ", thisIssue.file);
    		setTimeout(prepareNewFile, 100);
  		});
		}
		
		copyIssueFile();
	
		function prepareNewFile() {
			var content = fs.readFileSync(fileName, 'utf8');
			var blocks = content.split(thisIssue.title);	
			var firstBlock = blocks[0] + thisIssue.title;
			oldNewsBlock = blocks[1];

			fs.writeFileSync(newFile, firstBlock);
			
			/*Find old news */
			var urlParts = content.split('<a href="')
			for(var i=1; i< urlParts.length; i++) {
				var thisPart = urlParts[i];
				var thisUrl = thisPart.split('">')[0];
				var parts = thisUrl.split('?');
				oldNews.push(parts[0]);	
			}
			setTimeout(findIssueNews, 100);			
		}
	
		function findIssueNews() {
			for(var i=0; i< $allNews.length; i++) {
				var $thisNew = $($allNews[i]);
				var thisText = $thisNew.text();
				if($thisNew.text().indexOf(thisIssue.label) !== -1){
					//console.log("Found :\n", $thisNew.text());
					/* Filter against old news */
					var thisUrl = $thisNew.find('a').attr('href');
					var parts = thisUrl.split('?');
					thisUrl = parts[0];
					var isOld = false;
					for(var j=0; j<oldNews.length ; j++) {
						var thisOldNew = oldNews[j];
						var n = thisUrl.localeCompare(thisOldNew);
						if(n === 0) {
							isOld = true;
							break;	
						}
					}
					if(!isOld) {
						//console.log("Found :\n", $thisNew.html());
						var thisNew = '\n---\n' + $thisNew.html().trim();
						var thisNewParts = thisNew.split(thisIssue.label);
						thisNew = thisNewParts.join('');
						fs.appendFileSync(newFile, thisNew);
					}	
				}
			}
			fs.appendFileSync(newFile, oldNewsBlock);	
			setTimeout(publish, 100);
		}

		function publish() {
      var cmd  = 'cp ' + newFile + ' ' + thisIssue.file ;
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log("Published ", thisIssue.file);
				
				issueIndex ++;
				if(issueIndex < issues.length) {
					setTimeout(processOneIssue, 100);
				} else {
					console.log("Done!");
	
					if(goOfficial) {
						setTimeout(pushToGithub, 100);
					}
				}
      });
		}
	}

	processOneIssue();
}

function pushToGithub() {
  var commit = 'cd ../../; git commit -m ' + (new Date()).toISOString();;
  console.log(commit);
  /* $ git status  */
  exec("cd ../../; git status", (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);

    /* $ git add --all  */
    exec("cd ../../; git add --all", (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);

      /* $ git commit */
      exec(commit, (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);

        /* $ git push */
        exec('cd ../../; git push origin master', (error, stdout, stderr) => {
          if (error) {
            console.log(`error: ${error.message}`);
            return;
          }
          if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
          }
          console.log(`stdout: ${stdout}`);
        });
      });
    });
  });
}

