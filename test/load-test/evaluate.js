/* eslint-disable no-console*/

 const knex = require('../../server/db/knex');

 let total_diff = 0;
 let max_diff = -1;

 knex('visits').where({
   place_id: 5,
 }).then((results) => {
   for (let i = 0; i < results.length; i++) {
     const time_diff = new Date(results[i].created_at) - new Date(results[i].macaddress);
     total_diff += time_diff;
     if (max_diff < time_diff) {
       max_diff = time_diff;
     }
   }
   console.log('Se registraron un total de: ', results.length, 'visitas');
   console.log(`El máximo tiempo de respuesta fue de: ${max_diff} ms`);
   console.log(`El tiempo promedio de respuesta fue de: ${total_diff / results.length} ms`);
 }).catch((err) => {
   console.log(err);
 });
