export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Forward the request to the backend
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
    const backendResponse = await fetch(`${apiUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    // Check if the response is JSON before parsing
    const contentType = backendResponse.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await backendResponse.json();
    } else {
      // If not JSON, return a generic error
      const text = await backendResponse.text();
      console.error('Non-JSON response from backend:', text);
      data = { detail: 'Internal server error', error: text };
    }

    res.status(backendResponse.status).json(data);
  } catch (error) {
    console.error('Error forwarding request to backend:', error);
    res.status(500).json({ error: 'Cannot connect to backend server. Please make sure backend is running on port 8001.' });
  }
}