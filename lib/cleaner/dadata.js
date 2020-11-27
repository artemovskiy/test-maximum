const http = require('http');
const { URL } = require('url');

const postJsonRequest = (url, headers, body) => {
  const urlObject = new URL(url);
  const data = Buffer.from(JSON.stringify(body));

  const options = {
    hostname: urlObject.hostname,
    port: urlObject.port,
    path: urlObject.pathname + urlObject.search,
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, res => {
      let responseBodyBuffer = '';

      res.on('data', d => {
        responseBodyBuffer += d;
      });

      res.on('end', () => {
        try {
          const responseData = JSON.parse(responseBodyBuffer);

          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: responseData
          });
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', e => {
      reject(e);
    });

    req.write(data);
    req.end();
  });
};

const url = process.env.DADATA_URL;
const token = process.env.DADATA_TOKEN;
const secret = process.env.DADATA_SECRET;

export default async function(query) {
  const response = await postJsonRequest(
    url,
    {
      Authorization: `Token ${token}`,
      'X-Secret': secret
    },
    [query]
  );
  if (response.statusCode !== 200) {
    throw new Error(response.data.message);
  }
  return response.data;
}
