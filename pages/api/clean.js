import { URL } from 'url';
import { CleanerService } from '../../lib/cleaner/cleaner-service';

export default async (req, res) => {
  const urlObj = new URL(req.url, 'http://localhost');
  const query = urlObj.searchParams.get('query');
  if (typeof query !== 'string') {
    throw new TypeError('invalid query');
  }
  try {
    const data = await CleanerService.performQuery(query);
    res.status(200);
    res.setHeader('Content-type', 'application/json');
    res.end(JSON.stringify(data));
  } catch (e) {
    console.error(e);
    res.status(500);
    res.setHeader('Content-type', 'application/json');
    res.end(
      JSON.stringify({
        error: {
          message: e.message
        }
      })
    );
  }
};
