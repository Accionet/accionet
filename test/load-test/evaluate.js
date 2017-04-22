 const knex = require('../../server/db/knex');

 const time_diff = [];

 knex('visits').where({ place_id: 41 }).then((results) => {
   for (let i = 0; i < results.length; i++) {
     time_diff.push(new Date(results[i].created_at) - new Date(results[i].macaddress));
   } }).catch((err) => {
     console.log(err);
   });
