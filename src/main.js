const { Client, Sites, VCSDeploymentType } = require('node-appwrite');

module.exports = async function ({ req, res, log, error }) {
  try {
    const endpoint = req.headers['x-appwrite-endpoint'];
    const project = req.headers['x-appwrite-project'];
    const siteId = req.headers['x-appwrite-site-id'];
    const key = req.headers['x-appwrite-key'];

    if (!endpoint || !project || !key) {
      error('Unauthorized: Missing Appwrite credentials');
      return res.json({ error: 'Unauthorized: Missing Appwrite credentials' }, 401);
    }

    if (!siteId) {
      error('Bad Request: Missing Site ID');
      return res.json({ error: 'Bad Request: Missing Site ID' }, 400);
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
