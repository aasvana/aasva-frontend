import routes from '../../resources/router/routes.json';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler({ req, res }: { req: NextApiRequest; res: NextApiResponse }) {
  if (req.method === 'GET') {
    res.status(200).json(routes);
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
