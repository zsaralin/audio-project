const generateRhyme = async (note) => {
    try {
        const response = await fetch('/api/save-note', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ note }),
        });

        if (response.ok) {
            const responseData = await response.json();
            const generatedText = responseData.generatedText;
            return generatedText;
        } else {
            console.error('Failed to generate rhyme on the backend.');
            return null; // Handle the error or return an appropriate value
        }
    } catch (error) {
        console.error('Error:', error.message);
        return null; // Handle the error or return an appropriate value
    }
};

export default generateRhyme;
