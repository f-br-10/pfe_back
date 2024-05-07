// serviceController.js


const ovh = require('../ovhinit.js');
async function getServices(req, res) {
  try {
    const services = await ovh.request('GET', '/services');

    res.json(services);
  } catch (error) {
    console.error('Erreur lors de la récupération de la liste des services OVH:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de la liste des services OVH' });
  }
}
async function getServiceDetails(req, res) {
  try {
    const { serviceId } = req.params;
    const result = await ovh.request('GET', `/services/${serviceId}`);
    res.json(result);
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du service OVH:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des détails du service OVH' });
  }
}


module.exports = {
  getServiceDetails,getServices
};
