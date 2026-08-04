export const normalizeUser = (userData) => {
  return {
    name: {
      first: userData.firstName,
      middle: userData.middleName || '',
      last: userData.lastName,
    },
    phone: userData.phone,
    email: userData.email,
    password: userData.password,
    address: {
      state: userData.address?.state || '',
      country: userData.address?.country,
      city: userData.address?.city,
      street: userData.address?.street,
      houseNumber: userData.address?.houseNumber,
      zip: userData.address?.zip || 0,
    },
    image: {
      url: userData.image?.url || '',
      alt: userData.image?.alt || '',
    },
    isRecruiter: userData.isRecruiter || false,
  };
};

export const normalizeJob = (jobData) => {
  return {
    title: jobData.title,
    company: jobData.company,
    description: jobData.description,
    category: jobData.category,
    location: jobData.location,
    jobType: jobData.jobType,
    experienceLevel: jobData.experienceLevel,
    minSalary: Number(jobData.minSalary),
    maxSalary: Number(jobData.maxSalary),
    contact: {
      phone: jobData.phone,
      email: jobData.email,
      applicationUrl: jobData.applicationUrl || '',
    },
    image: {
      url: jobData.image?.url || '',
      alt: jobData.image?.alt || '',
    }
  };
};
