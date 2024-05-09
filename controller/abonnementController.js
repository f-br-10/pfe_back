//abonnementController.js
const exampleResponse = require('../exempleResponse.js');

function calculateRemainingTime(req, res) {
  try {
    const expirationDate = new Date(exampleResponse.exampleResponse.expirationDate);
    const currentTime = new Date();
    const remainingTimeMs = expirationDate - currentTime;

    const days = Math.floor(remainingTimeMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingTimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTimeMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingTimeMs % (1000 * 60)) / 1000);

    res.json({ days, hours, minutes, seconds });
  } catch (error) {
    console.error('Erreur lors du calcul de la durée restante jusqu\'à l\'expiration:', error);
    res.status(500).json({ message: 'Erreur lors du calcul de la durée restante jusqu\'à l\'expiration' });
  }
}

module.exports = {
  calculateRemainingTime
};
