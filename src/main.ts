import { Client, Sites, VCSDeploymentType } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  try {

    const client = new Client()
      .setEndpoint(req.headers['x-appwrite-endpoint'])
      .setProject(req.headers['x-appwrite-project'])
      .setKey(req.headers['x-appwrite-key']);

    const sites = new Sites(client);

    const redeploy = await sites.createVcsDeployment(
      req.headers['x-appwrite-site-id'],
      VCSDeploymentType.Branch,
      'main',
      true
    );

    log('Redeploy triggered successfully');

    return res.json({
      success: true,
      deploymentId: redeploy.$id
    });

  } catch (err) {
    error('Redeploy failed: ' + err.message);
    return res.json({ error: 'Redeploy failed' }, 500);
  }
};
