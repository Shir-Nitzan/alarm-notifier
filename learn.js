const request = require('request');
const prompt = require('prompt-sync')();
const translate = require("translate"); // Old school

// let fetch = require('node-fetch');
let qSyntax = function () {
    return {
        desc : 'Takes as input city from user and alerts when a missile attack arrives in the area',
        doSomething : function () {
            const areasTimesMap = new Map()
            areasTimesMap.set('Oteph','immediately' )
            areasTimesMap.set('north','1.5-3 min' )
            areasTimesMap.set('center', '1-1.5 min' )
            areasTimesMap.set('south', '1.5-3 min' )

            const headersHistoryAlarms = {
                'Connection': 'keep-alive',
                'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
                'Accept': '*/*',
                'X-Requested-With': 'XMLHttpRequest',
                'sec-ch-ua-mobile': '?0',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Dest': 'empty',
                'Referer': 'https://www.oref.org.il//12481-he/Pakar.aspx',
                'Accept-Language': 'en-US,en;q=0.9',
                'If-Modified-Since': 'Mon, 17 May 2021 00:17:21 GMT',
                'Cookie': '_hjid=3fd5b67c-0d9c-41da-a265-99c18bb1701a; _ga=GA1.3.188480683.1620848742; _fbp=fb.2.1620848742270.1618161180; zdSessionId_07713213=c7a0fd5d-f694-42d6-b944-cda7bdb57300; _gid=GA1.3.2011568767.1621191460; Lastalerts=; pakar_sound_unmute=0; 07713213-ehtoken=SharedAccessSignature sr=http%3A%2F%2Fprod-sb-appanalytics-us1.servicebus.windows.net%2F&sig=i1O%2FgB%2FmsM7rkY9O4VDc9qahm4YcwPSKBtuMXQe94pU%3D&se=1621212423&skn=all; _hjTLDTest=1; _hjAbsoluteSessionInProgress=1; ASP.NET_SessionId=zrwpje0p33rltimdwtilqzuh; TS013a1194=010f83961d2e2e6c17d572d5de10ea551e7a56e8ec5019ade9b0182b2bd9e071b1530973f5ab74bb072f900aae33f2c2dae7dc33a6d2c34b62f0b2f3b98e7ff9a0a2a450d5; __atssc=google%3B7; __atuvc=2%7C19%2C10%7C20; __atuvs=60a1b585d69f89e2008; _gat_UA-161451162-1=1'
            };

            const optionsHistoryAlarms = {
                url: 'https://www.oref.org.il//Shared/Ajax/GetAlarmsHistory.aspx?lang=he&mode=1',
                headers: headersHistoryAlarms
            };
            const headersServer = {
                'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
                'Accept': 'text/plain, */*; q=0.01',
                'Referer': 'https://www.oref.org.il/12481-he/Pakar.aspx',
                'X-Requested-With': 'XMLHttpRequest',
                'sec-ch-ua-mobile': '?0',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            };

            const optionsServer = {
                url: 'https://www.oref.org.il/WarningMessages/alert/alerts.json',
                headers: headersServer
            };

            class UserLocation {

                constructor() {
                    this.home = new Location (prompt('Enter home location (center/north/south/Oteph)' ))
                    this.work =  new Location (prompt('Enter work location (center/north/south/Oteph)'))
                    this.school =  new Location (prompt('Enter school location (center/north/south/Oteph)'))
                    let currentInput = prompt('What is your current location: (options - home/work/school/Oteph) ');
                    switch (currentInput) {
                        case 'home':
                            this.current = this.home;
                            break;
                        case 'work':
                            this.current = this.work;
                            break;
                        case 'school':
                            this.current = this.school;
                            break;
                    }
                }
            }
            class Location {
                constructor(area) {
                    this.name = area;
                    this.timeToShalter = areasTimesMap.get(area);
                }
            }
            let userLocation =  new UserLocation();
            console.log(userLocation);
            let quit = false
            let alarmsHistoryNum =  parseInt(prompt('Enter number of last alarms data to show: '));


            function callbackServer(error, response, body) {
                let json = JSON.parse(body);
                let items = null;
                if (!error && response.statusCode == 200) {
                    items = json.slice(0, alarmsHistoryNum)
                    items.forEach(elem => {
                        // Hebrew strings are reversed when parsed
                        elem.data =  elem.data.toString().split('').reverse().join('');
                    })
                    console.log(items)
                }
            }

            request(optionsHistoryAlarms, callbackServer);

            new Promise(resolve => {  console.log('starting alarms server! you will get a message if attack will happen.')})


            function callback(error, response, body) {
                if (!error && response.statusCode == 200) {
                    if (response.headers['content-length'] > 0) {
                        console.log(body);
                    }
                    console.log(response.headers['content-length'], 'Content-Length')

                }
            }

            new Promise(((resolve, reject) => {
                setInterval(() => {

                }, 2000)

            })).then((value) => {
                console.log("server ended with success");
            }).catch((error) => {
                console.log("server ended with error", error);
            })
        }
    }

}

qSyntax().doSomething()
