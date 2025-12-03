const getAllMeetups = async (req, res) => {
  res.status(501).json({ message: 'Get meetups not implemented' });
};

const getMeetupById = async (req, res) => {
  res.status(501).json({ message: 'Get meetup by id not implemented' });
};

const createMeetup = async (req, res) => {
  res.status(501).json({ message: 'Create meetup not implemented' });
};

module.exports = {
  getAllMeetups,
  getMeetupById,
  createMeetup
};

