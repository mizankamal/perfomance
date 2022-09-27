import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';



const datakey = new SharedArray('data key', function () 
{  
return JSON.parse(open('../data/data1.json')).key;
});


export default function () {
  for (let i=0; i<datakey.length; i++)
  {
  const url = `https://example.com/`;
  
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'api-key' : datakey[i]
    },
  };

  const res = http.get(url, params);
  console.log(res.status);
  console.log(res.request.headers['Api-Key']);
  // console.log(res.status);


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

