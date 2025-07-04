export const sendCandidateEmail = async ({ name, email, role, skills }) => {
  const response = await fetch('http://localhost:5000/api/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, role, skills }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to send email');
  }

  return await response.json(); // returns { success: true, id: ... }
};
