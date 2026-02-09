// This file handles /api/tasks/[id] routes using dynamic routing for DELETE and PUT
export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'Task ID is required' });
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
    let backendResponse;

    if (req.method === 'DELETE') {
      // Forward DELETE request to backend
      backendResponse = await fetch(`${apiUrl}/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': req.headers.authorization || '',
          'Content-Type': 'application/json',
        },
      });
    } else if (req.method === 'PUT') {
      // Forward PUT request to backend
      backendResponse = await fetch(`${apiUrl}/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': req.headers.authorization || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });
    } else {
      return res.status(405).json({ message: 'Method not allowed' });
    }

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