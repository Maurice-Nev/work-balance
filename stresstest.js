import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  stages: [
    { duration: '60s', target: 50 },   // Warm-up
    { duration: '60s', target: 100 }, // Mid-load
    { duration: '60s', target: 200 }, // Mid-load
    { duration: '60s', target: 300 }, // Mid-load
    { duration: '60s', target: 400 }, // Mid-load
    { duration: '60s', target: 500 }, // Peak 1
    { duration: '60s', target: 600 }, // Mid-load
    { duration: '60s', target: 700 }, // Peak 2
    { duration: '180s', target: 0 },    // Cooldown
  ],
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
