const firstName = 'Jonathan';
const lastName = 'Shanmuganantham';

const BaseData = {
  firstName,
  lastName,
  get fullName() {
    return `${firstName} ${lastName}`;
  },
};

export default BaseData;
