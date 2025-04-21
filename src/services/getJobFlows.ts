
export const getJobFlows = async () => {
  console.log('Fetching all job flows');

  try {
    const response = await fetch('https://primary-production-005c.up.railway.app/webhook/job-list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'job-list',
        data: {}
      }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('Job flows retrieved:', responseData);

    return responseData;
  } catch (error) {
    console.error('Error in getJobFlows:', error);
    throw error;
  }
};
