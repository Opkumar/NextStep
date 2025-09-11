

const dummyData = {
  routes: [
    {

      _id: '60c72b2f9b1e8b001c8e4a11',
      name: 'Central Jalandhar to Model Town',
      routeNumber: 'R1',
      stops: [
        { name: 'Bus Stand', location: { type: 'Point', coordinates: [75.5762, 31.3260] } },
        { name: 'Shaheed Udham Singh Nagar', location: { type: 'Point', coordinates: [75.5721, 31.3228] } },
        { name: 'Avtar Nagar', location: { type: 'Point', coordinates: [75.5670, 31.3195] } },
        { name: "Asha Vidya Mandir School", location: { type: 'Point', coordinates: [75.5630, 31.3170] } },
        { name: 'Tagore Nagar', location: { type: 'Point', coordinates: [75.5601, 31.3150] } }
      ]
    },
    {
      _id: '60c72b2f9b1e8b001c8e4a12',
      name: 'Urban Estate to Phagwara Gate',
      routeNumber: 'R2',
      stops: [
        { name: 'Urban Estate Phase II', location: { type: 'Point', coordinates: [75.5890, 31.3340] } },
        { name: 'Lajpat Nagar', location: { type: 'Point', coordinates: [75.5850, 31.3325] } },
        { name: 'B.M.C. Chowk', location: { type: 'Point', coordinates: [75.5820, 31.3295] } },
        { name: 'Phagwara Gate', location: { type: 'Point', coordinates: [75.5790, 31.3270] } }
      ]
    }
  ],
  buses: [
    { busNumber: 'PB08-1234', licensePlate: 'PB08-AB-1234',routeNumber: 'R1', currentRoute: '60c72b2f9b1e8b001c8e4a11', location: { type: 'Point', coordinates: [75.5750, 31.3255] } },
    { busNumber: 'PB08-5678', licensePlate: 'PB08-CD-5678', routeNumber: 'R2',currentRoute: '60c72b2f9b1e8b001c8e4a12', location: { type: 'Point', coordinates: [75.5890, 31.3340] } }
  ]
};

module.exports = dummyData;
