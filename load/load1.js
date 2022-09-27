import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import { Trend } from 'k6/metrics';

const myTrend = new Trend('waiting_time');
const dataAwb = new SharedArray('data awb', function () 
{  
return JSON.parse(open('../data/awb.json')).awb;
});
const count = dataAwb.length
  
  export let options = {
    summaryTrendStats: ["avg", "min", "med", "max", "p(90)", "p(95)", "p(99)"],
    stages: [
    
    { duration: '1s', target: 600 },
    
    { duration: '30s', target: 600   },
    
    ],
    
    };

export default function () {
  for (var i=0; i<count; i++){
  const url = `http://example.com/shopee/waybill?waybill=${dataAwb[i]}`;


  const params = {
    headers: {
      'Content-Type': 'application/json',
      'api-key': 'hiden',
    },
  };

  const res = http.get(url, params);
  console.log('Response time was ' + String(res.timings.duration) + ' ms');
  myTrend.add(res.timings.waiting);

  try {
    let responsedata = JSON.parse(res.body);
    console.log(responsedata.sicepat.result.waybill_number);
  } catch (error) {
    console.log(res.body)
  }

  check(res, {
            'is status 200': (r) => r.status == 200,
            'is status  0': (r) => r.status == 0,
            'is status  400': (r) => r.status == 400,
            'is status  401': (r) => r.status == 401,
            'is status  403': (r) => r.status == 403,
            'is status  500': (r) => r.status == 500,
            'is status  502': (r) => r.status == 502,
            'is status  504': (r) => r.status == 504
  });
  sleep(1);
}
}

