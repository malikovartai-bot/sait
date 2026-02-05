const http = require('http');

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;
const EVENT_IDS = process.argv.slice(2).length ? process.argv.slice(2) : ['marat','okna','окна-город-любовь'];

function fetchList(eventId){
  return new Promise((resolve, reject)=>{
    const path = `/api/img-list/${encodeURIComponent(eventId)}`;
    const opts = { hostname: HOST, port: PORT, path, method: 'GET' };
    const req = http.request(opts, (res)=>{
      let data='';
      res.setEncoding('utf8');
      res.on('data', c=>data+=c);
      res.on('end', ()=>{
        try{
          const parsed = JSON.parse(data||'{}');
          resolve(parsed);
        }catch(e){ reject(e); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

(async ()=>{
  for(const id of EVENT_IDS){
    try{
      const result = await fetchList(id);
      console.log(`\n== ${id} ==`);
      console.log(JSON.stringify(result, null, 2));
    }catch(e){
      console.error(`Error fetching ${id}:`, e && e.message);
    }
  }
})();
