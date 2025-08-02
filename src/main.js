const { Client, Sites, VCSDeploymentType } = require('node-appwrite');

export default async ({ req, res, log, error }) => {
  try {
    const notionSecret = process.env.NOTION_SECRET;

    if (notionSecret !== req.headers['x-notion-secret']) {
      error('Unauthorized: Invalid secret');
      return res.json({ error: 'Unauthorized' }, 401);
    }

    const endpoint = req.headers['x-appwrite-endpoint'];
    const project = req.headers['x-appwrite-project'];
    const siteId = req.headers['x-appwrite-site-id'];
    const key = req.headers['x-appwrite-key'];

    if (!endpoint || !project || !key) {
      error('Unauthorized: Missing credentials');
      return res.json({ error: 'Unauthorized: Missing credentials' }, 401);
    }

    if (!siteId) {
      error('Bad Request: Missing ID');
      return res.json({ error: 'Bad Request: Missing ID' }, 400);
    }

    const client = new Client()
      .setEndpoint(endpoint)
      .setProject(project)
      .setKey(key);

    const sites = new Sites(client);

    const redeploy = await sites.createVcsDeployment(
      siteId,
      VCSDeploymentType.Branch,
      'main',
      true
    );

    log(`Redeploy triggered successfully! Deployment ID: ${redeploy.$id}`);

    return res.json({
      success: true,
      deploymentId: redeploy.$id
    });

  } catch (err) {
    error('Redeploy failed: ' + err.message);
    return res.json({ error: 'Redeploy failed' }, 500);
  }
};
