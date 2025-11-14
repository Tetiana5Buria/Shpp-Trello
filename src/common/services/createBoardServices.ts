// createBoardServices.ts
/* export const createBoard = async (title: string, color: string, backgroundImage?: string) => {
  try {
    const response = await fetch('/api/boards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        color,
        custom: backgroundImage ? { background: backgroundImage } : undefined,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create board');
    }

    return await response.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error creating board:', error);
    throw error;
  }
};
 */
export {};
