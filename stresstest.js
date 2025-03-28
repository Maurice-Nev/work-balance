import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  stages: [
    { duration: '60s', target: 50 },   
    { duration: '60s', target: 100 }, 
    { duration: '60s', target: 200 }, 
    { duration: '60s', target: 300 }, 
    { duration: '60s', target: 400 }, 
    { duration: '60s', target: 500 }, 
    { duration: '60s', target: 600 }, 
    { duration: '60s', target: 700 }, 
    { duration: '60s', target: 800 }, 
    { duration: '60s', target: 900 }, 
    { duration: '60s', target: 1000 }, 
    
  ],
  gracefulRampDown: '320s'
};

export default function () {
  let headers = {
    'Cookie': 'sessionToken=88d4194f-b623-4859-9c69-fb1d8fff463a',
  };

  let baseUrl = 'http://host.docker.internal:3000';

  let routes = [
    '/',
    '/departments',
    '/comments',
    '/dashboard',
    '/team',
    '/make-comments',
    '/register',
    '/login',
  ];

  for (let route of routes) {
    http.get(`${baseUrl}${route}`, { headers });
    sleep(1); // simuliert etwas Verweildauer, macht es realistischer
  }
}
