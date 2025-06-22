'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{ padding: 32, textAlign: 'center' }}>
          <h2>Something went wrong!</h2>
          <pre style={{ color: 'red' }}>{error.message}</pre>
          <button onClick={() => reset()}>Try again</button>
        </div>
      </body>
    </html>
  );
} 